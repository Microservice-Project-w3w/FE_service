import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import App from "@/App";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useManagerScopeStore } from "@/modules/manager-context/store/manager-scope.store";
import { managerQuotationApprovalsApi } from "@/modules/quotations/api/manager-quotation-approvals.api";

// Opt in only when the local backend and demo seed are running.
describe.skipIf(process.env.RUN_LIVE_API_TESTS !== "1")(
  "active routes with live APIs",
  () => {
    const nativeFetch = globalThis.fetch;
    let pending = 0;
    let failures: string[] = [];

    beforeAll(() => {
      vi.stubGlobal("fetch", async (...args: Parameters<typeof fetch>) => {
        pending++;
        try {
          const response = await nativeFetch(...args);
          if (!response.ok)
            failures.push(`${response.status}: ${String(args[0])}`);
          return response;
        } catch (error) {
          failures.push(`Network error: ${String(args[0])}`);
          throw error;
        } finally {
          pending--;
        }
      });
    });

    afterEach(() => cleanup());

    const routes: [string, string][] = [
      ["admin", "/admin/accounts"],
      ["admin", "/admin/employees"],
      ["admin", "/admin/branches"],
      ["admin", "/admin/categories"],
      ["manager", "/manager/quotation-approvals"],
      ["manager", "/manager/contract-approvals"],
      ["manager", "/manager/rentals"],
      ["manager", "/manager/contracts/2"],
      ["manager", "/manager/equipment"],
      ["sales", "/sales/customers"],
      ["sales", "/sales/customers/1"],
      ["sales", "/sales/rental-requests"],
      ["sales", "/sales/rental-requests/all"],
      ["sales", "/sales/rental-requests/create"],
      ["sales", "/sales/rental-requests/1"],
      ["sales", "/sales/quotations"],
      ["sales", "/sales/quotations/create"],
      ["sales", "/sales/quotations/1"],
      ["sales", "/sales/rentals"],
      ["sales", "/sales/rentals/create"],
      ["sales", "/sales/rentals/1"],
      ["sales", "/sales/contracts"],
      ["sales", "/sales/contracts/create"],
      ["sales", "/sales/contracts/1"],
      ["operations", "/operations/equipment"],
      ["admin", "/profile"],
      ["manager", "/profile"],
      ["sales", "/profile"],
      ["operations", "/profile"],
      ["manager", "/settings"],
      ["admin", "/assistant"],
      ["manager", "/assistant"],
    ];

    it.each(routes)(
      "%s can open %s",
      async (account, path) => {
        useManagerScopeStore.getState().resetManagerScope();
        await useAuthStore.getState().login({
          identifier: `rentai.demo.${account}@gmail.com`,
          password: "Demo@123",
          rememberMe: false,
        });
        failures = [];
        window.history.replaceState({}, "", path);
        const errors: unknown[][] = [];
        const spy = vi
          .spyOn(console, "error")
          .mockImplementation((...args) => errors.push(args));
        const view = render(<App />);
        // Flush chained fetches and React effects between each step.
        for (let i = 0; i < 100; i++) {
          await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
          });
          if (
            pending === 0 &&
            i > 8 &&
            !view.container.querySelector(".animate-pulse")
          )
            break;
        }
        spy.mockRestore();
        expect(
          errors,
          JSON.stringify(errors.map((args) => args.map(String))),
        ).toEqual([]);
        expect(failures).toEqual([]);
        expect(view.container.textContent?.length).toBeGreaterThan(100);
        expect(view.container.textContent).not.toContain(
          "Không thể hiển thị trang",
        );
        expect(view.container.querySelector(".animate-pulse")).toBeNull();
        expect(view.queryByRole("alert")).toBeNull();
        if (/\/(customers|quotations|rentals|contracts)\/\d+$/.test(path)) {
          expect(window.location.pathname).toBe(path);
        }
        if (path === "/operations/equipment") {
          for (const label of [
            "Kho",
            "Nhập kho",
            "Xuất kho",
            "Chuyển kho",
            "Kiểm kê",
          ]) {
            fireEvent.click(
              view.getByRole("button", { name: label, exact: true }),
            );
            for (let i = 0; i < 100; i++) {
              await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 30));
              });
              if (pending === 0 && i > 8) break;
            }
            expect(failures).toEqual([]);
            expect(view.queryByRole("alert")).toBeNull();
          }
        }
        if (path === "/manager/quotation-approvals") {
          const user = useAuthStore.getState().user!;
          const list = await managerQuotationApprovalsApi.getList({
            organizationId: String(user.organizationId),
            assignedBranchIds: user.branchIds.map(String),
            selectedScopeId: "ALL",
          });
          expect(list.quotations.length).toBeGreaterThan(0);
          const quotation = await managerQuotationApprovalsApi.getById(
            list.quotations[0].id,
          );
          expect(Number.isFinite(Date.parse(quotation.rentalStartDate))).toBe(
            true,
          );
          expect(Number.isFinite(Date.parse(quotation.rentalEndDate))).toBe(
            true,
          );
          fireEvent.click(view.getAllByTitle("Xem chi tiết")[0]);
          for (let i = 0; i < 100; i++) {
            await act(async () => {
              await new Promise((resolve) => setTimeout(resolve, 30));
            });
            if (pending === 0 && i > 8) break;
          }
          expect(view.getByLabelText("Đóng chi tiết báo giá")).toBeTruthy();
          expect(view.container.textContent).not.toContain(
            "Không thể hiển thị trang",
          );
          expect(failures).toEqual([]);
        }
      },
      20000,
    );
  },
);
