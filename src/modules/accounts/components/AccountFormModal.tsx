import {
  Eye,
  EyeOff,
  LoaderCircle,
  RefreshCcw,
  UserPlus,
  X,
} from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import {
  USER_ROLE_LABELS,
} from "@/core/auth/roleLabels";

import {
  USER_ROLES,
  type UserRole,
} from "@/modules/auth/types/auth.types";

import type {
  Account,
  AccountStatus,
} from "@/modules/accounts/types/account.types";

export interface AccountFormValues {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  branchName: string;
  status: AccountStatus;
  temporaryPassword: string;
}

interface AccountFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  branchName?: string;
  temporaryPassword?: string;
}

interface AccountFormModalProps {
  open: boolean;
  account: Account | null;
  branches: string[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    values: AccountFormValues,
  ) => Promise<void>;
}

const createTemporaryPassword =
  (): string => {
    const randomValue = Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase();

    return `RentAI@${randomValue}`;
  };

const createInitialValues = (
  account: Account | null,
): AccountFormValues => {
  if (account) {
    return {
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      role: account.role,
      branchName: account.branchName,
      status: account.status,
      temporaryPassword: "",
    };
  }

  return {
    fullName: "",
    email: "",
    phone: "",
    role: "SALES_STAFF",
    branchName:
      "Chi nhánh Hà Nội",
    status: "ACTIVE",
    temporaryPassword:
      createTemporaryPassword(),
  };
};

const accountStatuses: Array<{
  value: AccountStatus;
  label: string;
}> = [
  {
    value: "ACTIVE",
    label: "Đang hoạt động",
  },
  {
    value: "INACTIVE",
    label: "Ngừng hoạt động",
  },
  {
    value: "LOCKED",
    label: "Đã khóa",
  },
  {
    value: "PENDING",
    label: "Chờ kích hoạt",
  },
];

const inputClassName = [
  "h-12 w-full rounded-2xl border border-slate-200",
  "bg-white px-4 text-sm font-medium text-slate-800",
  "outline-none transition",
  "placeholder:text-slate-400",
  "hover:border-blue-300",
  "focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
].join(" ");

export const AccountFormModal = ({
  open,
  account,
  branches,
  isSubmitting,
  onClose,
  onSubmit,
}: AccountFormModalProps) => {
  const isEditMode = account !== null;

  const [values, setValues] =
    useState<AccountFormValues>(
      createInitialValues(account),
    );

  const [errors, setErrors] =
    useState<AccountFormErrors>({});

  const [
    showTemporaryPassword,
    setShowTemporaryPassword,
  ] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues(
      createInitialValues(account),
    );

    setErrors({});
    setShowTemporaryPassword(false);

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ): void => {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    account,
    isSubmitting,
    onClose,
  ]);

  if (!open) {
    return null;
  }

  const validateForm = (): boolean => {
    const nextErrors: AccountFormErrors =
      {};

    if (
      values.fullName.trim().length < 2
    ) {
      nextErrors.fullName =
        "Họ tên phải có ít nhất 2 ký tự.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        values.email.trim(),
      )
    ) {
      nextErrors.email =
        "Email không đúng định dạng.";
    }

    if (
      !/^0[0-9]{9}$/.test(
        values.phone.trim(),
      )
    ) {
      nextErrors.phone =
        "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.";
    }

    if (!values.branchName) {
      nextErrors.branchName =
        "Vui lòng chọn chi nhánh.";
    }

    if (
      !isEditMode &&
      values.temporaryPassword.length < 8
    ) {
      nextErrors.temporaryPassword =
        "Mật khẩu tạm thời phải có ít nhất 8 ký tự.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length ===
      0
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit({
      ...values,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    });
  };

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-form-title"
        className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_35px_100px_rgba(15,23,42,0.28)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white shadow-lg shadow-blue-200">
              <UserPlus size={23} />
            </span>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Quản lý tài khoản
              </p>

              <h2
                id="account-form-title"
                className="mt-1 text-xl font-bold text-slate-950"
              >
                {isEditMode
                  ? "Chỉnh sửa tài khoản"
                  : "Thêm tài khoản mới"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </header>

        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Họ và tên
                </span>

                <input
                  type="text"
                  value={values.fullName}
                  onChange={(event) => {
                    setValues({
                      ...values,
                      fullName:
                        event.target.value,
                    });
                  }}
                  placeholder="Nhập họ và tên"
                  className={inputClassName}
                />

                {errors.fullName && (
                  <span className="mt-1.5 block text-xs font-medium text-red-600">
                    {errors.fullName}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Email
                </span>

                <input
                  type="email"
                  value={values.email}
                  onChange={(event) => {
                    setValues({
                      ...values,
                      email:
                        event.target.value,
                    });
                  }}
                  placeholder="name@rentai.vn"
                  className={inputClassName}
                />

                {errors.email && (
                  <span className="mt-1.5 block text-xs font-medium text-red-600">
                    {errors.email}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Số điện thoại
                </span>

                <input
                  type="tel"
                  value={values.phone}
                  onChange={(event) => {
                    setValues({
                      ...values,
                      phone:
                        event.target.value,
                    });
                  }}
                  placeholder="0901234567"
                  className={inputClassName}
                />

                {errors.phone && (
                  <span className="mt-1.5 block text-xs font-medium text-red-600">
                    {errors.phone}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Vai trò
                </span>

                <select
                  value={values.role}
                  onChange={(event) => {
                    setValues({
                      ...values,
                      role:
                        event.target
                          .value as UserRole,
                    });
                  }}
                  className={inputClassName}
                >
                  {USER_ROLES.map(
                    (role) => (
                      <option
                        key={role}
                        value={role}
                      >
                        {
                          USER_ROLE_LABELS[
                            role
                          ]
                        }
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Chi nhánh
                </span>

                <select
                  value={values.branchName}
                  onChange={(event) => {
                    setValues({
                      ...values,
                      branchName:
                        event.target.value,
                    });
                  }}
                  className={inputClassName}
                >
                  {values.role ===
                    "ADMIN" && (
                    <option value="Tất cả chi nhánh">
                      Tất cả chi nhánh
                    </option>
                  )}

                  {branches.map(
                    (branch) => (
                      <option
                        key={branch}
                        value={branch}
                      >
                        {branch}
                      </option>
                    ),
                  )}
                </select>

                {errors.branchName && (
                  <span className="mt-1.5 block text-xs font-medium text-red-600">
                    {errors.branchName}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Trạng thái
                </span>

                <select
                  value={values.status}
                  onChange={(event) => {
                    setValues({
                      ...values,
                      status:
                        event.target
                          .value as AccountStatus,
                    });
                  }}
                  className={inputClassName}
                >
                  {accountStatuses.map(
                    (status) => (
                      <option
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </option>
                    ),
                  )}
                </select>
              </label>

              {!isEditMode && (
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Mật khẩu tạm thời
                  </span>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <input
                        type={
                          showTemporaryPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          values.temporaryPassword
                        }
                        onChange={(event) => {
                          setValues({
                            ...values,
                            temporaryPassword:
                              event.target
                                .value,
                          });
                        }}
                        className={`${inputClassName} pr-12`}
                      />

                      <button
                        type="button"
                        aria-label={
                          showTemporaryPassword
                            ? "Ẩn mật khẩu"
                            : "Hiện mật khẩu"
                        }
                        onClick={() => {
                          setShowTemporaryPassword(
                            (current) =>
                              !current,
                          );
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        {showTemporaryPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setValues({
                          ...values,
                          temporaryPassword:
                            createTemporaryPassword(),
                        });
                      }}
                      className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                    >
                      <RefreshCcw
                        size={17}
                      />
                      Tạo mật khẩu
                    </button>
                  </div>

                  {errors.temporaryPassword && (
                    <span className="mt-1.5 block text-xs font-medium text-red-600">
                      {
                        errors.temporaryPassword
                      }
                    </span>
                  )}

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Người dùng cần đổi mật khẩu
                    sau lần đăng nhập đầu tiên.
                  </p>
                </label>
              )}
            </div>
          </div>

          <footer className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50/80 px-6 py-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="h-11 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 min-w-36 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              )}

              {isSubmitting
                ? "Đang lưu..."
                : isEditMode
                  ? "Lưu thay đổi"
                  : "Tạo tài khoản"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};
