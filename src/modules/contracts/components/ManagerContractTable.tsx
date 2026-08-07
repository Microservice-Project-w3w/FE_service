import {
  Check,
  Eye,
  X,
} from "lucide-react";

import {
  ContractPriorityBadge,
  ContractStatusBadge,
} from "@/modules/contracts/components/ContractApprovalBadge";

import type {
  ManagerContract,
} from "@/modules/contracts/types/manager-contract-approval.types";

interface ManagerContractTableProps {
  contracts: ManagerContract[];
  isLoading?: boolean;

  onView: (
    contract: ManagerContract,
  ) => void;

  onApprove: (
    contract: ManagerContract,
  ) => void;

  onReject: (
    contract: ManagerContract,
  ) => void;
}

const currencyFormatter =
  new Intl.NumberFormat(
    "vi-VN",
    {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    },
  );

const dateFormatter =
  new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

export const ManagerContractTable = ({
  contracts,
  isLoading = false,
  onView,
  onApprove,
  onReject,
}: ManagerContractTableProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Danh sách hợp đồng
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Kiểm tra giá trị, lịch thanh toán và các điều khoản hợp đồng.
          </p>
        </div>

        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {contracts.length} kết quả
        </span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1300px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mã hợp đồng
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Chi nhánh
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Khách hàng / Sự kiện
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Thời gian thuê
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Giá trị hợp đồng
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ưu tiên
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trạng thái
              </th>

              <th className="w-44 px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({
                length: 4,
              }).map((_, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100"
                >
                  <td
                    colSpan={8}
                    className="px-6 py-4"
                  >
                    <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : contracts.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-16 text-center"
                >
                  <p className="font-semibold text-slate-700">
                    Không tìm thấy hợp đồng phù hợp
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Hãy thay đổi bộ lọc hoặc phạm vi chi nhánh.
                  </p>
                </td>
              </tr>
            ) : (
              contracts.map(
                (contract) => {
                  const isPending =
                    contract.status ===
                    "PENDING_APPROVAL";

                  return (
                    <tr
                      key={contract.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/30"
                    >
                      <td className="px-6 py-4 align-top">
                        <button
                          type="button"
                          onClick={() =>
                            onView(contract)
                          }
                          className="font-semibold text-blue-700 transition hover:text-blue-800"
                        >
                          {contract.contractCode}
                        </button>

                        <p className="mt-1 text-xs text-slate-400">
                          Báo giá{" "}
                          {contract.quotationCode}
                        </p>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-600">
                        {contract.branchName}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <p className="font-medium text-slate-800">
                          {contract.customerName}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {contract.eventName}
                        </p>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-600">
                        {dateFormatter.format(
                          new Date(
                            contract.rentalStartDate,
                          ),
                        )}
                        {" - "}
                        {dateFormatter.format(
                          new Date(
                            contract.rentalEndDate,
                          ),
                        )}
                      </td>

                      <td className="px-4 py-4 text-right align-top font-semibold text-slate-900">
                        {currencyFormatter.format(
                          contract.totalContractValue,
                        )}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <ContractPriorityBadge
                          priority={
                            contract.priority
                          }
                        />
                      </td>

                      <td className="px-4 py-4 align-top">
                        <ContractStatusBadge
                          status={
                            contract.status
                          }
                        />
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="Xem chi tiết"
                            onClick={() =>
                              onView(contract)
                            }
                            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                          >
                            <Eye size={17} />
                          </button>

                          {isPending && (
                            <>
                              <button
                                type="button"
                                title="Duyệt hợp đồng"
                                onClick={() =>
                                  onApprove(
                                    contract,
                                  )
                                }
                                className="flex size-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                              >
                                <Check
                                  size={17}
                                />
                              </button>

                              <button
                                type="button"
                                title="Từ chối hợp đồng"
                                onClick={() =>
                                  onReject(
                                    contract,
                                  )
                                }
                                className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                              >
                                <X size={17} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                },
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
