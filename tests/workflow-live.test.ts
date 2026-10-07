import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { authApi } from "@/modules/auth/api/auth.api";
import { authStorage } from "@/modules/auth/api/auth.storage";
import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import type { AuthSession, ApiEnvelope } from "@/modules/auth/types/auth.types";
import { accountsApi } from "@/modules/accounts/api/accounts.api";
import { operationsInventoryApi as inventory } from "@/modules/equipment/api/operations-inventory.api";
import { salesRentalWorkflowApi as rental } from "@/modules/rentals/api/sales-rental-workflow.api";

// Explicit opt-in: this suite writes isolated AUDIT-* fixtures to the demo DB.
// It never resets seed data; completed documents remain as audit history.
describe.skipIf(process.env.RUN_LIVE_WORKFLOW_TESTS !== "1")(
  "live core business workflow",
  () => {
    const sessions = new Map<string, AuthSession>();
    const prefix = `AUDIT-${Date.now()}`;
    const warehouses: number[] = [];
    let equipmentId: number | undefined;
    let orderId: number | undefined;
    let contractId: number | undefined;
    let accountId: string | undefined;
    const originalSession = authStorage.getSession();
    function as(role: string) {
      authStorage.saveSession(sessions.get(role)!);
    }
    const localDate = (days: number) => {
      const d = new Date(Date.now() + days * 86400000);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19);
    };
    async function envelope<T>(
      method: "GET" | "POST" | "PATCH",
      path: string,
      body?: unknown,
    ) {
      return (
        await authenticatedRequest<ApiEnvelope<T>>(method, path, { body })
      ).data;
    }
    async function status(method: string, path: string, body?: unknown) {
      const response = await fetch(`http://localhost:8080${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${authStorage.getSession()!.accessToken}`,
          "Content-Type": "application/json",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
      });
      await response.text();
      return response.status;
    }
    beforeAll(async () => {
      for (const role of ["admin", "manager", "sales", "operations"]) {
        sessions.set(
          role,
          await authApi.login({
            identifier: `rentai.demo.${role}@gmail.com`,
            password: "Demo@123",
            rememberMe: false,
          }),
        );
      }
    }, 30000);
    afterAll(async () => {
      // Only clean up our own fixtures, through authorized public APIs.
      if (contractId) {
        as("admin");
        await envelope(
          "PATCH",
          `/api/v1/rental-contracts/${contractId}/cancel`,
          { reason: `${prefix}: kết thúc kiểm thử` },
        );
      }
      if (orderId) {
        as("manager");
        await rental.cancelOrder(orderId, `${prefix}: kết thúc kiểm thử`);
      }
      as("operations");
      if (equipmentId) await inventory.changeStatus(equipmentId, 1, "RETIRED");
      for (const id of warehouses)
        await inventory.setWarehouseActive(id, false);
      if (accountId) {
        as("admin");
        await accountsApi.remove(accountId);
      }
      if (originalSession) authStorage.saveSession(originalSession);
      else authStorage.clearSession();
    }, 30000);

    it("rejects org/branch scope violations and grants only the agreed Manager actions", async () => {
      as("manager");
      expect(sessions.get("manager")!.user.permissions).toContain(
        "rental.order.cancel",
      );
      expect(sessions.get("manager")!.user.permissions).toContain(
        "rental.contract.extend",
      );
      expect(
        await status(
          "GET",
          "/api/v1/inventory/equipment?organizationId=9999&branchId=1",
        ),
      ).toBe(403);
      expect(
        await status(
          "GET",
          "/api/v1/inventory/equipment?organizationId=1&branchId=2",
        ),
      ).toBe(403);
      expect(
        await status("POST", "/api/v1/inventory/warehouses", {
          organizationId: 1,
          branchId: 2,
          code: prefix,
          name: prefix,
        }),
      ).toBe(403);
      as("operations");
      expect(
        await status("POST", "/api/v1/inventory/warehouses", {
          organizationId: 1,
          branchId: 2,
          code: prefix,
          name: prefix,
        }),
      ).toBe(403);
    });

    it("persists every account form field and selected scope instead of hardcoding branch 1", async () => {
      as("admin");
      expect(
        await status("POST", "/api/v1/users", {
          fullName: "Invalid email",
          email: `${prefix.toLowerCase()}@example.com`,
          password: "Demo@123",
          roleCode: "SALES_STAFF",
          organizationId: 1,
          branchIds: [1],
          status: "ACTIVE",
        }),
      ).toBe(400);
      const options = await accountsApi.getAll({
        search: "",
        role: "ALL",
        status: "ALL",
        branchName: "ALL",
      });
      const branchName = options.branches!.find((b) => b.endsWith("(#2)"))!;
      expect(branchName).toBeTruthy();
      const payload = {
        fullName: `${prefix} user`,
        email: `${prefix.toLowerCase()}@gmail.com`,
        phone: "0901234567",
        role: "SALES_STAFF" as const,
        branchName,
        status: "ACTIVE" as const,
        temporaryPassword: "Demo@123",
      };
      const created = await accountsApi.create(payload);
      accountId = created.id;
      expect(created.phone).toBe(payload.phone);
      expect(created.branchIds).toEqual([2]);
      expect(Number.isFinite(Date.parse(created.createdAt))).toBe(true);
      const updated = await accountsApi.update(created.id, {
        ...payload,
        fullName: `${prefix} updated`,
        email: `${prefix.toLowerCase()}-updated@gmail.com`,
        phone: "0987654321",
        role: "OPERATIONS_STAFF",
        status: "INACTIVE",
      });
      const loaded = await accountsApi.getById(created.id);
      expect(loaded).toMatchObject({
        fullName: updated.fullName,
        email: updated.email,
        phone: "0987654321",
        role: "OPERATIONS_STAFF",
        status: "INACTIVE",
        branchIds: [2],
        branchName,
      });
    }, 20000);

    it("runs stock-in/out/transfer/audit, then request → quotation → reserve → confirm → contract → extension", async () => {
      as("operations");
      const models = await authenticatedRequest<
        { id: number; equipmentTypeId: number }[]
      >("GET", "/api/v1/inventory/models?organizationId=1");
      const model = models[0];
      expect(model).toBeTruthy();
      const a = await inventory.saveWarehouse({
        organizationId: 1,
        branchId: 1,
        code: `${prefix}-A`,
        name: `${prefix} kho A`,
        address: "Kiểm thử",
      });
      warehouses.push(a.id);
      const b = await inventory.saveWarehouse({
        organizationId: 1,
        branchId: 1,
        code: `${prefix}-B`,
        name: `${prefix} kho B`,
        address: "Kiểm thử",
      });
      warehouses.push(b.id);
      const gear = await inventory.saveEquipment({
        organizationId: 1,
        branchId: 1,
        warehouseId: null,
        modelId: model.id,
        assetCode: prefix,
        serialNumber: `${prefix}-SN`,
        conditionStatus: "GOOD",
        note: "Thiết bị kiểm thử riêng",
      });
      equipmentId = gear.id;
      const actor = Number(sessions.get("operations")!.user.id);
      const common = {
        organizationId: 1,
        branchId: 1,
        warehouseId: a.id,
        createdBy: actor,
        items: [{ equipmentId: gear.id }],
      };
      const stockIn = await inventory.createDocument("stock-in", {
        ...common,
        stockInCode: `${prefix}-IN`,
      });
      await inventory.documentAction("stock-in", stockIn.id, "confirm", {
        confirmedBy: actor,
      });
      const stockOut = await inventory.createDocument("stock-out", {
        ...common,
        stockOutCode: `${prefix}-OUT`,
      });
      await inventory.documentAction("stock-out", stockOut.id, "confirm", {
        confirmedBy: actor,
      });
      const returned = await inventory.createDocument("stock-in", {
        ...common,
        stockInCode: `${prefix}-RETURN`,
      });
      await inventory.documentAction("stock-in", returned.id, "confirm", {
        confirmedBy: actor,
      });
      const transfer = await inventory.createDocument("transfers", {
        organizationId: 1,
        sourceWarehouseId: a.id,
        destinationWarehouseId: b.id,
        transferCode: `${prefix}-TRANSFER`,
        createdBy: actor,
        items: [{ equipmentId: gear.id }],
      });
      await inventory.documentAction("transfers", transfer.id, "approve", {
        approvedBy: actor,
      });
      await inventory.documentAction("transfers", transfer.id, "dispatch");
      await inventory.documentAction("transfers", transfer.id, "receive", {
        receivedBy: actor,
      });
      const audit = await inventory.createDocument("stock-audits", {
        organizationId: 1,
        branchId: 1,
        warehouseId: b.id,
        auditCode: `${prefix}-COUNT`,
        createdBy: actor,
      });
      await inventory.documentAction("stock-audits", audit.id, "start", {
        startedBy: actor,
      });
      await inventory.documentAction("stock-audits", audit.id, "items", {
        equipmentId: gear.id,
        result: "FOUND",
        actualWarehouseId: b.id,
        checkedBy: actor,
      });
      await inventory.documentAction("stock-audits", audit.id, "complete", {
        completedBy: actor,
      });
      expect(
        (await inventory.loadEquipment(1, 1)).find((e) => e.id === gear.id),
      ).toMatchObject({ warehouseId: b.id, status: "AVAILABLE" });
      as("sales");
      const request = await rental.createRequest({
        organizationId: 1,
        branchId: 1,
        customerId: 2,
        startAt: localDate(30),
        endAt: localDate(32),
        note: prefix,
        items: [{ equipmentTypeId: model.equipmentTypeId, quantity: 1 }],
      });
      const quote = await rental.createQuotation({
        rentalRequestId: request.id,
        rentalAmount: 1000000,
        depositAmount: 500000,
        deliveryFee: 0,
        validUntil: localDate(3),
        specialTerms: prefix,
      });
      expect((await rental.sendQuotation(quote.id)).status).toBe("SENT");
      as("manager");
      await envelope("PATCH", `/api/v1/quotations/${quote.id}/approve`);
      as("sales");
      expect(
        await status(
          "PATCH",
          `/api/v1/quotations/${quote.id}/record-acceptance`,
          { customerConfirmed: false },
        ),
      ).toBe(400);
      expect((await rental.recordAcceptance(quote.id)).status).toBe("ACCEPTED");
      const order = await rental.convertQuotationToOrder(quote.id);
      orderId = order.id;
      as("manager");
      await envelope("PATCH", `/api/v1/rental-orders/${order.id}/reserve`, {
        reservedUntil: localDate(1),
        equipmentIds: [gear.id],
      });
      const confirmed = await rental.confirmOrder(order.id);
      expect(confirmed.status).toBe("CONFIRMED");
      as("sales");
      const contract = await rental.createContract(order.id, prefix);
      contractId = contract.id;
      as("manager");
      await envelope(
        "PATCH",
        `/api/v1/rental-contracts/${contract.id}/approve`,
      );
      as("sales");
      await rental.recordSignature(contract.id);
      as("manager");
      const newEndAt = localDate(34);
      const appendix = await rental.extendContract(
        contract.id,
        newEndAt,
        `${prefix}: thêm hai ngày`,
      );
      await rental.appendixAction(appendix.id, "approve");
      as("sales");
      await rental.recordSignature(appendix.id, true);
      as("manager");
      expect(
        await status("PATCH", `/api/v1/rental-orders/${order.id}/cancel`, {
          reason: "Không được hủy khi hợp đồng còn hiệu lực",
        }),
      ).toBe(400);
      as("sales");
      expect((await rental.getContract(contract.id)).endAt).toBe(newEndAt);
      expect((await rental.getOrder(String(order.id))).endAt).toBe(newEndAt);
      as("operations");
      const reservation = await authenticatedRequest<{
        endAt: string;
        status: string;
      }>(
        "GET",
        `/api/v1/inventory/reservations/${confirmed.inventoryReservationId}`,
      );
      expect(reservation).toMatchObject({
        endAt: newEndAt,
        status: "CONFIRMED",
      });
    }, 60000);
  },
);
