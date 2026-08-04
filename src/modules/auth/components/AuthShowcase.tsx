import {
  BarChart3,
  Box,
  CircleHelp,
  CreditCard,
  FileText,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

interface AuthShowcaseProps {
  variant: "login" | "register";
}

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName: string;
}

interface StatisticItem {
  icon: LucideIcon;
  value: string;
  label: string;
  valueClassName: string;
}

const loginFeatures: FeatureItem[] = [
  {
    icon: Box,
    title: "Quản lý thiết bị",
    description:
      "Theo dõi tình trạng, lịch sử sử dụng và bảo trì thiết bị theo thời gian thực.",
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    icon: FileText,
    title: "Quản lý hợp đồng",
    description:
      "Tạo, theo dõi và quản lý hợp đồng thuê thiết bị dễ dàng, chính xác.",
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: CreditCard,
    title: "Quản lý thanh toán",
    description:
      "Theo dõi công nợ, thanh toán và doanh thu minh bạch, tự động.",
    iconClassName: "bg-orange-50 text-orange-600",
  },
];

const registerFeatures: FeatureItem[] = [
  {
    icon: Box,
    title: "Quản lý thiết bị thông minh",
    description:
      "Theo dõi tình trạng, vị trí và lịch sử sử dụng thiết bị theo thời gian thực.",
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    icon: FileText,
    title: "Hợp đồng & thanh toán",
    description:
      "Tự động hóa hợp đồng, nhắc hạn và đối soát thanh toán nhanh chóng.",
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Báo cáo & phân tích",
    description:
      "Báo cáo trực quan, số liệu chính xác giúp ra quyết định hiệu quả.",
    iconClassName: "bg-amber-50 text-amber-600",
  },
];

const loginStatistics: StatisticItem[] = [
  {
    icon: Users,
    value: "1.000+",
    label: "Khách hàng tin dùng",
    valueClassName: "text-blue-600",
  },
  {
    icon: Box,
    value: "10.000+",
    label: "Thiết bị được quản lý",
    valueClassName: "text-emerald-600",
  },
  {
    icon: ShieldCheck,
    value: "99,9%",
    label: "Thời gian hoạt động",
    valueClassName: "text-blue-600",
  },
];

const registerStatistics: StatisticItem[] = [
  {
    icon: Users,
    value: "2.348+",
    label: "Khách hàng tin dùng",
    valueClassName: "text-blue-600",
  },
  {
    icon: Box,
    value: "12.000+",
    label: "Thiết bị đang quản lý",
    valueClassName: "text-emerald-600",
  },
  {
    icon: FileText,
    value: "15.600+",
    label: "Hợp đồng đã xử lý",
    valueClassName: "text-amber-600",
  },
  {
    icon: BarChart3,
    value: "98,5%",
    label: "Khách hàng hài lòng",
    valueClassName: "text-blue-600",
  },
];

interface DashboardPreviewProps {
  showPhone: boolean;
}

const DashboardPreview = ({
  showPhone,
}: DashboardPreviewProps) => {
  const summaryItems = [
    ["Tổng thiết bị", "1.248"],
    ["Thiết bị sẵn sàng", "612"],
    ["Đang cho thuê", "386"],
    ["Doanh thu tháng", "2,45 tỷ"],
  ];

  const contracts = [
    "HD250526-0186",
    "HD250525-0125",
    "HD250524-0009",
  ];

  return (
    <div className="relative mx-auto mt-8 w-full max-w-[650px] px-8 animate-fade-up-delay-1">
      <div className="animate-dashboard-float overflow-hidden rounded-[26px] border border-blue-100/80 bg-white shadow-[0_25px_70px_rgba(37,99,235,0.13)]">
        <header className="flex h-12 items-center gap-4 border-b border-slate-100 px-4">
          <span className="flex size-6 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
            R
          </span>

          <div className="h-5 flex-1 rounded-md bg-slate-50" />

          <div className="flex gap-2">
            <span className="size-5 rounded-full bg-slate-100" />
            <span className="size-5 rounded-full bg-slate-100" />
          </div>
        </header>

        <div className="grid grid-cols-[52px_1fr]">
          <aside className="space-y-4 border-r border-slate-100 p-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <span
                key={index}
                className={[
                  "block size-5 rounded-md",
                  index === 1
                    ? "bg-blue-100"
                    : "bg-slate-100",
                ].join(" ")}
              />
            ))}
          </aside>

          <main className="p-4">
            <p className="text-xs font-semibold text-slate-700">
              Tổng quan hệ thống
            </p>

            <section className="mt-3 grid grid-cols-4 gap-2">
              {summaryItems.map(([label, value]) => (
                <article
                  key={label}
                  className="rounded-lg border border-slate-100 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="size-5 rounded-md bg-blue-50" />

                  <p className="mt-2 truncate text-[7px] text-slate-400">
                    {label}
                  </p>

                  <p className="mt-1 text-[10px] font-bold text-slate-700">
                    {value}
                  </p>
                </article>
              ))}
            </section>

            <section className="mt-3 grid grid-cols-[1.3fr_0.7fr] gap-3">
              <article className="rounded-lg border border-slate-100 p-3">
                <p className="text-[8px] font-semibold text-slate-500">
                  Doanh thu & đơn thuê
                </p>

                <div className="mt-4 flex h-24 items-end gap-2 border-b border-l border-slate-100 px-2">
                  {[35, 52, 42, 70, 58, 88, 75].map(
                    (height, index) => (
                      <span
                        key={index}
                        className="flex-1 rounded-t bg-blue-100 transition-all duration-300 hover:bg-blue-300"
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    ),
                  )}
                </div>
              </article>

              <article className="rounded-lg border border-slate-100 p-3">
                <p className="text-[8px] font-semibold text-slate-500">
                  Trạng thái thiết bị
                </p>

                <div
                  className="mx-auto mt-4 flex size-24 items-center justify-center rounded-full transition duration-300 hover:scale-105"
                  style={{
                    background:
                      "conic-gradient(#2563eb 0 34%, #10b981 34% 64%, #f59e0b 64% 82%, #ef4444 82% 100%)",
                  }}
                >
                  <div className="flex size-14 flex-col items-center justify-center rounded-full bg-white">
                    <strong className="text-xs text-slate-700">
                      1.248
                    </strong>

                    <span className="text-[7px] text-slate-400">
                      Tổng
                    </span>
                  </div>
                </div>
              </article>
            </section>
          </main>
        </div>
      </div>

      <span className="animate-float-y absolute left-0 top-16 flex size-20 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-lg">
        <Box size={35} />
      </span>

      <span className="animate-float-y absolute right-0 top-4 flex size-20 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-600 shadow-lg">
        <FileText size={35} />
      </span>

      {!showPhone && (
        <span className="animate-float-y absolute -right-2 bottom-0 flex size-20 items-center justify-center rounded-2xl border border-orange-100 bg-white text-orange-500 shadow-lg">
          <CreditCard size={35} />
        </span>
      )}

      {showPhone && (
        <div className="animate-float-y absolute -right-3 bottom-0 w-36 rounded-[28px] border-[5px] border-slate-200 bg-white p-3 shadow-xl">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />

          <p className="text-[8px] font-semibold text-slate-700">
            Hợp đồng sắp hết hạn
          </p>

          <div className="mt-3 space-y-2">
            {contracts.map((contract, index) => (
              <div
                key={contract}
                className="rounded-lg bg-slate-50 p-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "size-4 rounded",
                      index === 0
                        ? "bg-red-100"
                        : index === 1
                          ? "bg-purple-100"
                          : "bg-emerald-100",
                    ].join(" ")}
                  />

                  <span className="text-[6px] font-semibold text-slate-600">
                    {contract}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const AuthShowcase = ({
  variant,
}: AuthShowcaseProps) => {
  const isRegister =
    variant === "register";

  const features = isRegister
    ? registerFeatures
    : loginFeatures;

  const statistics = isRegister
    ? registerStatistics
    : loginStatistics;

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[linear-gradient(180deg,#f8faff_0%,#eef5ff_100%)] px-8 py-8 xl:px-14">
      <div className="absolute left-1/2 top-24 size-[620px] -translate-x-1/2 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="absolute bottom-10 left-10 size-44 rounded-full bg-blue-100/30 blur-3xl" />
      <div className="absolute right-10 top-16 size-32 rounded-full bg-emerald-100/30 blur-3xl" />

      {isRegister && (
        <button
          type="button"
          className="animate-fade-in absolute right-10 top-8 z-10 flex items-center gap-2 text-sm text-slate-600"
        >
          <CircleHelp size={18} />
          Cần hỗ trợ?
        </button>
      )}

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        {isRegister && (
          <div className="animate-fade-up mx-auto inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-5 py-2 text-sm font-medium text-blue-600 shadow-sm">
            <span className="size-2 rounded-full bg-blue-500" />
            Nền tảng quản lý cho thuê thiết bị thông minh
          </div>
        )}

        <h1 className="animate-fade-up mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight text-slate-950 xl:text-4xl">
          {isRegister ? (
            <>
              Quản lý cho thuê thiết bị
              <span className="block text-blue-600">
                toàn diện & hiệu quả
              </span>
            </>
          ) : (
            <>
              Nền tảng quản lý cho thuê thiết bị
              <span className="block">
                toàn diện và thông minh
              </span>
            </>
          )}
        </h1>

        <p className="animate-fade-up-delay-1 mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
          RentAI Manager giúp doanh nghiệp quản lý thiết bị,
          khách hàng, hợp đồng và thanh toán trên một nền tảng
          duy nhất.
        </p>
      </div>

      <DashboardPreview
        showPhone={isRegister}
      />

      <div className="relative z-10 mx-auto mt-9 grid w-full max-w-4xl grid-cols-3 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className={[
                "rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-sm",
                "transition duration-300 hover:-translate-y-1 hover:shadow-xl",
                index === 0
                  ? "animate-fade-up"
                  : index === 1
                    ? "animate-fade-up-delay-1"
                    : "animate-fade-up-delay-2",
              ].join(" ")}
            >
              <span
                className={[
                  "flex size-11 items-center justify-center rounded-xl",
                  feature.iconClassName,
                ].join(" ")}
              >
                <Icon size={22} />
              </span>

              <h2 className="mt-4 text-sm font-bold text-slate-900">
                {feature.title}
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>

      <div
        className={[
          "relative z-10 mx-auto mt-7 grid w-full max-w-4xl gap-4",
          "rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-sm",
          isRegister
            ? "grid-cols-4"
            : "grid-cols-3",
        ].join(" ")}
      >
        {statistics.map((statistic, index) => {
          const Icon = statistic.icon;

          return (
            <article
              key={statistic.label}
              className={[
                "flex items-center justify-center gap-3 rounded-xl px-2 py-2",
                "transition duration-300 hover:bg-white/80",
                index === 0
                  ? "animate-fade-up"
                  : index === 1
                    ? "animate-fade-up-delay-1"
                    : index === 2
                      ? "animate-fade-up-delay-2"
                      : "animate-fade-up-delay-3",
              ].join(" ")}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon size={21} />
              </span>

              <div>
                <p
                  className={[
                    "text-lg font-bold xl:text-xl",
                    statistic.valueClassName,
                  ].join(" ")}
                >
                  {statistic.value}
                </p>

                <p className="text-[11px] text-slate-500">
                  {statistic.label}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
