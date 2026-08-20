import {
    Eye,
    Filter,
    Package,
    Search,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router";

type EquipmentStatus =
    | "AVAILABLE"
    | "RENTED";

interface EquipmentItem {
    id: string;
    name: string;
    code: string;
    category: string;
    quantity: number;
    status: EquipmentStatus;
}

const EQUIPMENT: EquipmentItem[] = [
    {
        id: "equipment-001",
        name:
            "Loa Array JBL VTX A8",
        code: "EQ-001",
        category: "Âm thanh",
        quantity: 12,
        status: "AVAILABLE",
    },
    {
        id: "equipment-002",
        name: "Đèn Beam 450W",
        code: "EQ-002",
        category: "Ánh sáng",
        quantity: 16,
        status: "AVAILABLE",
    },
    {
        id: "equipment-003",
        name: "Màn hình LED P3",
        code: "EQ-003",
        category: "Trình chiếu",
        quantity: 8,
        status: "AVAILABLE",
    },
    {
        id: "equipment-004",
        name: "Micro Shure Axient",
        code: "EQ-004",
        category: "Âm thanh",
        quantity: 20,
        status: "AVAILABLE",
    },
    {
        id: "equipment-005",
        name:
            "Máy phát điện 100kVA",
        code: "EQ-005",
        category: "Khác",
        quantity: 10,
        status: "RENTED",
    },
];

export const SalesRequestedEquipmentPage =
    () => {
        const [
            search,
            setSearch,
        ] = useState("");

        const [
            category,
            setCategory,
        ] = useState("ALL");

        const filtered =
            useMemo(() => {
                const keyword =
                    search
                        .toLowerCase()
                        .trim();

                return EQUIPMENT.filter(
                    (item) => {
                        const matchesSearch =
                            !keyword ||
                            [
                                item.name,
                                item.code,
                                item.category,
                            ]
                                .join(" ")
                                .toLowerCase()
                                .includes(keyword);

                        const matchesCategory =
                            category ===
                            "ALL" ||
                            item.category ===
                            category;

                        return (
                            matchesSearch &&
                            matchesCategory
                        );
                    },
                );
            }, [
                search,
                category,
            ]);

        return (
            <main className="space-y-5">
                <header>
                    <div className="text-sm text-slate-500">
                        <Link
                            to="/sales/rental-requests"
                            className="hover:text-blue-600"
                        >
                            Yêu cầu thuê
                        </Link>

                        <span className="mx-2">
              /
            </span>

                        Tất cả thiết bị
                    </div>

                    <div className="mt-2 flex items-start gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Package
                  size={21}
              />
            </span>

                        <div>
                            <h1 className="text-3xl font-bold text-slate-950">
                                Tất cả thiết bị
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Tra cứu thiết bị phục
                                vụ quá trình tạo yêu
                                cầu thuê.
                            </p>
                        </div>
                    </div>
                </header>

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <label className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                value={search}
                                onChange={(
                                    event,
                                ) => {
                                    setSearch(
                                        event.target.value,
                                    );
                                }}
                                placeholder="Tìm theo tên thiết bị, mã thiết bị, danh mục..."
                                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </label>

                        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700">
                            <Filter
                                size={17}
                            />

                            Bộ lọc
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {[
                            "ALL",
                            "Âm thanh",
                            "Ánh sáng",
                            "Trình chiếu",
                            "Sân khấu",
                            "Khác",
                        ].map(
                            (item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => {
                                        setCategory(
                                            item,
                                        );
                                    }}
                                    className={
                                        category ===
                                        item
                                            ? "rounded-full bg-blue-600 px-3.5 py-2 text-xs font-bold text-white"
                                            : "rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                                    }
                                >
                                    {item ===
                                    "ALL"
                                        ? "Tất cả (156)"
                                        : item}
                                </button>
                            ),
                        )}
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="hidden grid-cols-[70px_minmax(240px,1fr)_130px_150px_100px_130px_80px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold text-slate-500 xl:grid">
                        <span>STT</span>

                        <span>
              Tên thiết bị
            </span>

                        <span>
              Mã thiết bị
            </span>

                        <span>
              Danh mục
            </span>

                        <span>
              Số lượng
            </span>

                        <span>
              Trạng thái
            </span>

                        <span className="text-right">
              Thao tác
            </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {filtered.map(
                            (
                                item,
                                index,
                            ) => (
                                <article
                                    key={
                                        item.id
                                    }
                                    className="grid gap-4 px-5 py-4 xl:grid-cols-[70px_minmax(240px,1fr)_130px_150px_100px_130px_80px] xl:items-center"
                                >
                  <span className="text-sm text-slate-500">
                    {index +
                        1}
                  </span>

                                    <p className="text-sm font-bold text-slate-900">
                                        {
                                            item.name
                                        }
                                    </p>

                                    <span className="text-sm text-slate-600">
                    {
                        item.code
                    }
                  </span>

                                    <span className="w-fit rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {
                        item.category
                    }
                  </span>

                                    <span className="text-sm font-semibold text-slate-800">
                    {
                        item.quantity
                    }
                  </span>

                                    <span
                                        className={
                                            item.status ===
                                            "AVAILABLE"
                                                ? "w-fit rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
                                                : "w-fit rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700"
                                        }
                                    >
                    {item.status ===
                    "AVAILABLE"
                        ? "Sẵn sàng"
                        : "Đang thuê"}
                  </span>

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            <Eye
                                                size={
                                                    16
                                                }
                                            />
                                        </button>
                                    </div>
                                </article>
                            ),
                        )}
                    </div>

                    <footer className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <span className="text-xs text-slate-500">
              Hiển thị 1 -{" "}
                {
                    filtered.length
                }{" "}
                của 156 kết quả
            </span>

                        <div className="flex gap-1.5">
                            <button className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                                1
                            </button>

                            <button className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600">
                                2
                            </button>

                            <button className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600">
                                3
                            </button>

                            <span className="flex size-9 items-center justify-center text-sm text-slate-400">
                ...
              </span>

                            <button className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600">
                                16
                            </button>
                        </div>
                    </footer>
                </section>
            </main>
        );
    };