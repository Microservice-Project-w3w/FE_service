import {
  CalendarDays,
  CircleDollarSign,
  PackageCheck,
  Truck,
} from "lucide-react";

const statistics = [
  {
    title: "Tổng thiết bị",
    value: "0",
    description: "Thiết bị trong hệ thống",
    icon: PackageCheck,
  },
  {
    title: "Đang cho thuê",
    value: "0",
    description: "Đơn thuê đang hoạt động",
    icon: Truck,
  },
  {
    title: "Lịch giao hôm nay",
    value: "0",
    description: "Đơn cần giao trong ngày",
    icon: CalendarDays,
  },
  {
    title: "Doanh thu tháng",
    value: "0 ₫",
    description: "Tổng doanh thu tháng này",
    icon: CircleDollarSign,
  },
];

export const DashboardPage = () => {
  return (
    <div>
      <header>
        <p className="text-sm font-medium text-blue-600">
          Rental Manager
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Tổng quan hệ thống
        </h1>

        <p className="mt-2 text-gray-500">
          Quản lý hoạt động cho thuê máy móc và thiết bị sự kiện.
        </p>
      </header>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Icon size={22} />
                </div>

                <span className="text-xs font-medium text-gray-400">
                  Mock data
                </span>
              </div>

              <p className="mt-5 text-sm font-medium text-gray-500">
                {item.title}
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {item.value}
              </p>

              <p className="mt-2 text-sm text-gray-400">
                {item.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Giao diện đã sẵn sàng
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Đây là màn hình kiểm tra ban đầu. Bước tiếp theo sẽ xây
          sidebar, header và dashboard theo thiết kế của team.
        </p>
      </section>
    </div>
  );
};
