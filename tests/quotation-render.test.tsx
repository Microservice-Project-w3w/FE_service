import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ManagerQuotationTable } from "@/modules/quotations/components/ManagerQuotationTable";
import { initialManagerQuotations } from "@/modules/quotations/mocks/manager-quotation-approvals.mock";
import { createSafeDateFormatter } from "@/shared/utils/dateFormat";
import { ManagerQuotationDetailDrawer } from "@/modules/quotations/components/ManagerQuotationDetailDrawer";
import { PageErrorBoundary } from "@/shared/components/feedback/PageErrorBoundary";

afterEach(cleanup);

describe("API records with missing dates", () => {
  it("does not throw for empty or invalid dates", () => {
    const formatter = createSafeDateFormatter("vi-VN");
    expect(formatter.format(new Date(""))).toBe("Chưa có thông tin");
    expect(formatter.format(new Date("invalid"))).toBe("Chưa có thông tin");
    expect(formatter.format(new Date("2026-10-07"))).not.toBe(
      "Chưa có thông tin",
    );
  });
  it("keeps the quotation table visible even when rental dates are missing", () => {
    const quotation = {
      ...initialManagerQuotations[0],
      rentalStartDate: "",
      rentalEndDate: "",
    };
    const view = render(
      <ManagerQuotationTable
        quotations={[quotation]}
        onView={() => {}}
        onApprove={() => {}}
        onReject={() => {}}
      />,
    );
    expect(view.container.textContent).toContain(
      "Chưa có thông tin - Chưa có thông tin",
    );
  });
  it("keeps the quotation detail visible when rental dates are missing", () => {
    const quotation = {
      ...initialManagerQuotations[0],
      rentalStartDate: "",
      rentalEndDate: "",
      createdAt: "",
    };
    const view = render(
      <ManagerQuotationDetailDrawer
        quotation={quotation}
        isOpen
        onClose={() => {}}
        onApprove={() => {}}
        onReject={() => {}}
      />,
    );
    expect(view.container.textContent).toContain("Chưa có thông tin");
  });
  it("shows recovery actions if a child component crashes", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const BrokenPage = (): never => {
      throw new Error("Broken API record");
    };
    try {
      const view = render(
        <PageErrorBoundary>
          <BrokenPage />
        </PageErrorBoundary>,
      );
      expect(view.getByRole("alert").textContent).toContain(
        "Không thể hiển thị trang",
      );
      expect(view.getByRole("button", { name: "Tải lại trang" })).toBeTruthy();
    } finally {
      spy.mockRestore();
    }
  });
});
