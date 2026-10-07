import { useCallback } from "react";
import { Link, useParams } from "react-router";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import { useLiveData } from "@/shared/hooks/useLiveData";
import { LiveFields, LivePage } from "@/shared/components/data-display/LiveDataView";
import { formatLiveDate } from "@/shared/utils/liveFormat";

interface CustomerDto {
  id: number;
  customerCode: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  customerType: string;
  status: string;
  companyName: string | null;
  taxCode: string | null;
  fullName: string | null;
  representativeName: string | null;
  representativePhone: string | null;
  representativeEmail: string | null;
  branchId: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}
export function SalesCustomerDetailLivePage() {
  const { customerId = "" } = useParams();
  const organizationId = useAuthStore((s) => s.user?.organizationId);
  const loader = useCallback(async () => {
    if (!organizationId)
      throw new Error("Tài khoản chưa được gán organization.");
    return authenticatedRequest<CustomerDto>(
      "GET",
      `/api/v1/organizations/${organizationId}/customers/${customerId}`,
    );
  }, [customerId, organizationId]);
  const state = useLiveData(loader);
  const c = state.data;
  return (
    <LivePage
      title="Chi tiết khách hàng"
      loading={state.isLoading}
      error={state.error}
    >
      <Link to="/sales/customers">← Danh sách khách hàng</Link>
      {c && (
        <LiveFields
          fields={[
            ["Mã khách hàng", c.customerCode],
            ["Tên", c.displayName],
            ["Loại", c.customerType],
            ["Trạng thái", c.status],
            ["Chi nhánh", `#${c.branchId}`],
            ["Email", c.email],
            ["Điện thoại", c.phone],
            ["Địa chỉ", c.address],
            ["Tên công ty", c.companyName],
            ["Mã số thuế", c.taxCode],
            ["Người đại diện", c.representativeName ?? c.fullName],
            ["Điện thoại đại diện", c.representativePhone],
            ["Email đại diện", c.representativeEmail],
            ["Ghi chú", c.note],
            ["Ngày tạo", formatLiveDate(c.createdAt)],
            ["Cập nhật", formatLiveDate(c.updatedAt)],
          ]}
        />
      )}
    </LivePage>
  );
}
