import {
  initialManagerContracts,
} from "@/modules/contracts/mocks/manager-contract-approvals.mock";

import type {
  ApproveManagerContractInput,
  GetManagerContractsInput,
  ManagerContract,
  ManagerContractListData,
  RejectManagerContractInput,
} from "@/modules/contracts/types/manager-contract-approval.types";

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

let contractDatabase =
  structuredClone(
    initialManagerContracts,
  );

const getContractOrThrow = (
  contractId: string,
): ManagerContract => {
  const contract =
    contractDatabase.find(
      (item) =>
        item.id === contractId,
    );

  if (!contract) {
    throw new Error(
      "Không tìm thấy hợp đồng.",
    );
  }

  return contract;
};

const ensurePendingContract = (
  contract: ManagerContract,
): void => {
  if (
    contract.status !==
    "PENDING_APPROVAL"
  ) {
    throw new Error(
      "Hợp đồng này không còn ở trạng thái chờ duyệt.",
    );
  }
};

export const managerContractApprovalsApi =
  {
    async getList(
      input: GetManagerContractsInput,
    ): Promise<ManagerContractListData> {
      await delay();

      const allowedBranchIds =
        input.selectedScopeId === "ALL"
          ? input.assignedBranchIds
          : [
              input.selectedScopeId,
            ];

      const contracts =
        contractDatabase
          .filter(
            (contract) =>
              contract.organizationId ===
                input.organizationId &&
              allowedBranchIds.includes(
                contract.branchId,
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

      const pendingContracts =
        contracts.filter(
          (contract) =>
            contract.status ===
            "PENDING_APPROVAL",
        );

      const now =
        new Date(
          "2026-08-06T15:30:00.000Z",
        );

      const fortyEightHours =
        48 * 60 * 60 * 1000;

      const processedCount =
        contracts.filter(
          (contract) =>
            contract.status ===
              "APPROVED" ||
            contract.status ===
              "REJECTED" ||
            contract.status ===
              "SIGNED",
        ).length;

      return {
        summary: {
          pendingCount:
            pendingContracts.length,

          pendingValue:
            pendingContracts.reduce(
              (total, contract) =>
                total +
                contract.totalContractValue,
              0,
            ),

          expiringSoonCount:
            pendingContracts.filter(
              (contract) => {
                const deadline =
                  new Date(
                    contract.approvalDeadline,
                  ).getTime();

                const remainingTime =
                  deadline -
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

        contracts:
          structuredClone(
            contracts,
          ),

        generatedAt:
          new Date().toISOString(),
      };
    },

    async getById(
      contractId: string,
    ): Promise<ManagerContract> {
      await delay(140);

      return structuredClone(
        getContractOrThrow(
          contractId,
        ),
      );
    },

    async approve(
      input:
        ApproveManagerContractInput,
    ): Promise<ManagerContract> {
      await delay();

      const contract =
        getContractOrThrow(
          input.contractId,
        );

      ensurePendingContract(
        contract,
      );

      contract.status =
        "APPROVED";

      contract.approvalHistory.push({
        id: `history-contract-${Date.now()}`,
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
        contract,
      );
    },

    async reject(
      input:
        RejectManagerContractInput,
    ): Promise<ManagerContract> {
      await delay();

      const reason =
        input.reason.trim();

      if (!reason) {
        throw new Error(
          "Vui lòng nhập lý do từ chối hợp đồng.",
        );
      }

      const contract =
        getContractOrThrow(
          input.contractId,
        );

      ensurePendingContract(
        contract,
      );

      contract.status =
        "REJECTED";

      contract.approvalHistory.push({
        id: `history-contract-${Date.now()}`,
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
        contract,
      );
    },

    resetMockData(): void {
      contractDatabase =
        structuredClone(
          initialManagerContracts,
        );
    },
  };
