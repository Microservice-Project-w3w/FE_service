import {
  initialManagerQuotations,
} from "@/modules/quotations/mocks/manager-quotation-approvals.mock";

import type {
  ApproveManagerQuotationInput,
  GetManagerQuotationsInput,
  ManagerQuotation,
  ManagerQuotationListData,
  RejectManagerQuotationInput,
} from "@/modules/quotations/types/manager-quotation-approval.types";

const delay = async (
  milliseconds = 220,
): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(
      resolve,
      milliseconds,
    );
  });
};

let quotationDatabase =
  structuredClone(
    initialManagerQuotations,
  );

const getQuotationOrThrow = (
  quotationId: string,
): ManagerQuotation => {
  const quotation =
    quotationDatabase.find(
      (item) =>
        item.id === quotationId,
    );

  if (!quotation) {
    throw new Error(
      "Không tìm thấy báo giá.",
    );
  }

  return quotation;
};

const ensurePendingQuotation = (
  quotation: ManagerQuotation,
): void => {
  if (
    quotation.status !==
    "PENDING_APPROVAL"
  ) {
    throw new Error(
      "Báo giá này không còn ở trạng thái chờ duyệt.",
    );
  }
};

export const managerQuotationApprovalsApi =
  {
    async getList(
      input: GetManagerQuotationsInput,
    ): Promise<ManagerQuotationListData> {
      await delay();

      const allowedBranchIds =
        input.selectedScopeId === "ALL"
          ? input.assignedBranchIds
          : [
              input.selectedScopeId,
            ];

      const quotations =
        quotationDatabase
          .filter(
            (quotation) =>
              quotation.organizationId ===
                input.organizationId &&
              allowedBranchIds.includes(
                quotation.branchId,
              ),
          )
          .sort(
            (first, second) =>
              new Date(
                second.createdAt,
              ).getTime() -
              new Date(
                first.createdAt,
              ).getTime(),
          );

      const pendingQuotations =
        quotations.filter(
          (quotation) =>
            quotation.status ===
            "PENDING_APPROVAL",
        );

      const now =
        new Date(
          "2026-08-06T14:48:00.000Z",
        );

      const fortyEightHours =
        48 * 60 * 60 * 1000;

      const processedCount =
        quotations.filter(
          (quotation) =>
            quotation.status ===
              "APPROVED" ||
            quotation.status ===
              "REJECTED",
        ).length;

      return {
        summary: {
          pendingCount:
            pendingQuotations.length,

          pendingValue:
            pendingQuotations.reduce(
              (total, quotation) =>
                total +
                quotation.totalAmount,
              0,
            ),

          expiringSoonCount:
            pendingQuotations.filter(
              (quotation) => {
                const expiresAt =
                  new Date(
                    quotation.expiresAt,
                  ).getTime();

                const remainingTime =
                  expiresAt -
                  now.getTime();

                return (
                  remainingTime >= 0 &&
                  remainingTime <=
                    fortyEightHours
                );
              },
            ).length,

          processedCount,
        },

        quotations:
          structuredClone(
            quotations,
          ),

        generatedAt:
          new Date().toISOString(),
      };
    },

    async getById(
      quotationId: string,
    ): Promise<ManagerQuotation> {
      await delay(140);

      return structuredClone(
        getQuotationOrThrow(
          quotationId,
        ),
      );
    },

    async approve(
      input:
        ApproveManagerQuotationInput,
    ): Promise<ManagerQuotation> {
      await delay();

      const quotation =
        getQuotationOrThrow(
          input.quotationId,
        );

      ensurePendingQuotation(
        quotation,
      );

      quotation.status = "APPROVED";

      quotation.approvalHistory.push({
        id: `history-${Date.now()}`,
        action: "APPROVED",
        actorId:
          input.reviewerId,
        actorName:
          input.reviewerName,
        note:
          input.note?.trim() ||
          null,
        createdAt:
          new Date().toISOString(),
      });

      return structuredClone(
        quotation,
      );
    },

    async reject(
      input:
        RejectManagerQuotationInput,
    ): Promise<ManagerQuotation> {
      await delay();

      const reason =
        input.reason.trim();

      if (!reason) {
        throw new Error(
          "Vui lòng nhập lý do từ chối báo giá.",
        );
      }

      const quotation =
        getQuotationOrThrow(
          input.quotationId,
        );

      ensurePendingQuotation(
        quotation,
      );

      quotation.status = "REJECTED";

      quotation.approvalHistory.push({
        id: `history-${Date.now()}`,
        action: "REJECTED",
        actorId:
          input.reviewerId,
        actorName:
          input.reviewerName,
        note: reason,
        createdAt:
          new Date().toISOString(),
      });

      return structuredClone(
        quotation,
      );
    },

    resetMockData(): void {
      quotationDatabase =
        structuredClone(
          initialManagerQuotations,
        );
    },
  };
