import type {
  ManagerRentalPriority,
  ManagerRentalStatus,
  RentalPaymentStatus,
  RentalReservationStatus,
} from "@/modules/rentals/types/manager-rental.types";

const statusLabels: Record<
  ManagerRentalStatus,
  string
> = {
  PENDING_CONFIRMATION: "Chờ xác nhận",
  RESERVED: "Đã giữ chỗ",
  CONFIRMED: "Đã xác nhận",
  ACTIVE: "Đang thuê",
  OVERDUE: "Quá hạn",
  RETURNING: "Đang hoàn trả",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

const statusClasses: Record<
  ManagerRentalStatus,
  string
> = {
  PENDING_CONFIRMATION:
    "border-blue-200 bg-blue-50 text-blue-700",

  RESERVED:
    "border-blue-200 bg-blue-50 text-blue-700",

  CONFIRMED:
    "border-blue-200 bg-blue-50 text-blue-700",

  ACTIVE:
    "border-blue-200 bg-blue-50 text-blue-700",

  OVERDUE:
    "border-rose-200 bg-rose-50 text-rose-700",

  RETURNING:
    "border-slate-300 bg-slate-100 text-slate-700",

  COMPLETED:
    "border-slate-200 bg-slate-50 text-slate-600",

  CANCELLED:
    "border-slate-200 bg-slate-50 text-slate-500",
};

const priorityLabels: Record<
  ManagerRentalPriority,
  string
> = {
  URGENT: "Khẩn cấp",
  HIGH: "Ưu tiên cao",
  NORMAL: "Bình thường",
};

const priorityClasses: Record<
  ManagerRentalPriority,
  string
> = {
  URGENT:
    "border-rose-200 bg-rose-50 text-rose-700",

  HIGH:
    "border-blue-200 bg-blue-50 text-blue-700",

  NORMAL:
    "border-slate-200 bg-slate-50 text-slate-600",
};

const paymentLabels: Record<
  RentalPaymentStatus,
  string
> = {
  UNPAID: "Chưa thanh toán",
  PARTIALLY_PAID: "Thanh toán một phần",
  PAID: "Đã thanh toán",
  OVERDUE: "Quá hạn thanh toán",
};

const paymentClasses: Record<
  RentalPaymentStatus,
  string
> = {
  UNPAID:
    "border-slate-200 bg-slate-50 text-slate-600",

  PARTIALLY_PAID:
    "border-blue-200 bg-blue-50 text-blue-700",

  PAID:
    "border-blue-200 bg-blue-50 text-blue-700",

  OVERDUE:
    "border-rose-200 bg-rose-50 text-rose-700",
};

const reservationLabels: Record<
  RentalReservationStatus,
  string
> = {
  NOT_REQUIRED: "Không yêu cầu",
  PENDING: "Chờ giữ chỗ",
  HELD: "Đã giữ chỗ",
  RELEASED: "Đã giải phóng",
  EXPIRED: "Hết hạn giữ chỗ",
};

const reservationClasses: Record<
  RentalReservationStatus,
  string
> = {
  NOT_REQUIRED:
    "border-slate-200 bg-slate-50 text-slate-500",

  PENDING:
    "border-blue-200 bg-blue-50 text-blue-700",

  HELD:
    "border-blue-200 bg-blue-50 text-blue-700",

  RELEASED:
    "border-slate-200 bg-slate-50 text-slate-600",

  EXPIRED:
    "border-rose-200 bg-rose-50 text-rose-700",
};

interface ManagerRentalStatusBadgeProps {
  status: ManagerRentalStatus;
}

export const ManagerRentalStatusBadge = ({
  status,
}: ManagerRentalStatusBadgeProps) => (
  <span
    className={[
      "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
      statusClasses[status],
    ].join(" ")}
  >
    {statusLabels[status]}
  </span>
);

interface ManagerRentalPriorityBadgeProps {
  priority: ManagerRentalPriority;
}

export const ManagerRentalPriorityBadge = ({
  priority,
}: ManagerRentalPriorityBadgeProps) => (
  <span
    className={[
      "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
      priorityClasses[priority],
    ].join(" ")}
  >
    {priorityLabels[priority]}
  </span>
);

interface RentalPaymentStatusBadgeProps {
  status: RentalPaymentStatus;
}

export const RentalPaymentStatusBadge = ({
  status,
}: RentalPaymentStatusBadgeProps) => (
  <span
    className={[
      "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
      paymentClasses[status],
    ].join(" ")}
  >
    {paymentLabels[status]}
  </span>
);

interface RentalReservationStatusBadgeProps {
  status: RentalReservationStatus;
}

export const RentalReservationStatusBadge = ({
  status,
}: RentalReservationStatusBadgeProps) => (
  <span
    className={[
      "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
      reservationClasses[status],
    ].join(" ")}
  >
    {reservationLabels[status]}
  </span>
);
