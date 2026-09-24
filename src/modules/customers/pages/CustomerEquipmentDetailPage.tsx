import {
    ArrowLeft,
    Building2,
    Check,
    CheckCircle2,
    Image,
    MapPin,
    Package,
    ShieldCheck,
    ShoppingCart,
    Tag,
    Wrench,
} from "lucide-react";
import { useState } from "react";
import {
    Link,
    Navigate,
    useParams,
} from "react-router";

import {
    CustomerEquipmentStatusBadge,
} from "../components/CustomerEquipmentStatusBadge";
import {
    CUSTOMER_EQUIPMENT_MOCKS,
} from "../mocks/customerEquipment.mock";

type DetailTab =
    | "DETAIL"
    | "SPECIFICATIONS"
    | "USAGE"
    | "POLICY";

const TABS: {
    value: DetailTab;
    label: string;
}[] = [
    {
        value: "DETAIL",
        label: "Thông tin chi tiết",
    },
    {
        value: "SPECIFICATIONS",
        label: "Thông số kỹ thuật",
    },
    {
        value: "USAGE",
        label: "Hướng dẫn sử dụng",
    },
    {
        value: "POLICY",
        label: "Chính sách thuê",
    },
];

const formatCurrency = (
    value: number,
): string =>
    new Intl.NumberFormat("vi-VN").format(
        value,
    );

export const CustomerEquipmentDetailPage = () => {
    const { equipmentId } = useParams<{
        equipmentId: string;
    }>();

    const [
        activeTab,
        setActiveTab,
    ] = useState<DetailTab>("DETAIL");

    const equipment =
        CUSTOMER_EQUIPMENT_MOCKS.find(
            (item) => item.id === equipmentId,
        );

    if (!equipment) {
        return (
            <Navigate
                to="/customer/equipment"
                replace
            />
        );
    }

    const canRent =
        equipment.status !== "UNAVAILABLE" &&
        equipment.availableQuantity > 0;

    return (
        <main className="space-y-5">
            <Link
                to="/customer/equipment"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
                <ArrowLeft
                    size={18}
                    aria-hidden="true"
                />

                Quay lại danh sách thiết bị
            </Link>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
                <div className="grid items-stretch gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                    <div className="overflow-hidden rounded-2xl bg-slate-100">
                        <img
                            src={equipment.imageUrl}
                            alt={equipment.name}
                            className="h-[260px] w-full object-cover sm:h-[300px] lg:h-[330px]"
                        />
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="self-start">
                            <CustomerEquipmentStatusBadge
                                status={equipment.status}
                            />
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-slate-950 lg:text-3xl">
                            {equipment.name}
                        </h1>

                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <Tag
                                size={16}
                                aria-hidden="true"
                            />

                            <span>{equipment.code}</span>
                        </div>

                        <div className="mt-5">
              <span className="text-2xl font-bold text-blue-600 lg:text-3xl">
                {formatCurrency(
                    equipment.pricePerDay,
                )}{" "}
                  đ
              </span>

                            <span className="ml-2 text-sm text-slate-500">
                / {equipment.rentalUnit}
              </span>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Package
                                        size={17}
                                        aria-hidden="true"
                                    />

                                    <span className="text-xs font-medium">
                    Danh mục
                  </span>
                                </div>

                                <p className="mt-2 text-sm font-semibold text-slate-900">
                                    {equipment.category}
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Building2
                                        size={17}
                                        aria-hidden="true"
                                    />

                                    <span className="text-xs font-medium">
                    Chi nhánh
                  </span>
                                </div>

                                <p className="mt-2 text-sm font-semibold text-slate-900">
                                    {equipment.branch}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <div className="flex gap-3">
                                <CheckCircle2
                                    size={20}
                                    aria-hidden="true"
                                    className="mt-0.5 shrink-0 text-blue-600"
                                />

                                <div>
                                    <h2 className="text-sm font-bold text-blue-950">
                                        Thông tin thuê thiết bị
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-blue-800">
                                        Giá thuê có thể thay đổi theo thời
                                        gian, số lượng và chính sách của
                                        chi nhánh.
                                    </p>

                                    <p className="mt-2 text-xs font-semibold text-blue-700">
                                        Số lượng khả dụng:{" "}
                                        {equipment.availableQuantity}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {canRent ? (
                            <Link
                                to={`/customer/equipment/${equipment.id}/rental-request`}
                                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                <ShoppingCart
                                    size={18}
                                    aria-hidden="true"
                                />

                                Gửi yêu cầu thuê
                            </Link>
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="mt-5 flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-300 px-5 text-sm font-semibold text-white"
                            >
                                <ShoppingCart
                                    size={18}
                                    aria-hidden="true"
                                />

                                Thiết bị không khả dụng
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <nav className="flex gap-5 overflow-x-auto border-b border-slate-200 px-5">
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => {
                                setActiveTab(tab.value);
                            }}
                            className={[
                                "shrink-0 border-b-2 py-4 text-sm font-semibold transition",
                                activeTab === tab.value
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-500 hover:text-slate-900",
                            ].join(" ")}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="p-5 lg:p-6">
                    {activeTab === "DETAIL" && (
                        <div className="grid gap-5 lg:grid-cols-2">
                            <article>
                                <h2 className="text-base font-bold text-slate-950">
                                    Mô tả thiết bị
                                </h2>

                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {equipment.description}
                                </p>

                                <ul className="mt-4 space-y-2.5">
                                    {equipment.features.map(
                                        (feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-2 text-sm text-slate-600"
                                            >
                                                <Check
                                                    size={17}
                                                    aria-hidden="true"
                                                    className="mt-0.5 shrink-0 text-blue-600"
                                                />

                                                <span>{feature}</span>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </article>

                            <article className="rounded-2xl bg-slate-50 p-5">
                                <h2 className="text-base font-bold text-slate-950">
                                    Thông tin chung
                                </h2>

                                <dl className="mt-4 divide-y divide-slate-200">
                                    <div className="flex justify-between gap-4 py-3 text-sm">
                                        <dt className="text-slate-500">
                                            Mã thiết bị
                                        </dt>

                                        <dd className="font-semibold text-slate-900">
                                            {equipment.code}
                                        </dd>
                                    </div>

                                    <div className="flex justify-between gap-4 py-3 text-sm">
                                        <dt className="text-slate-500">
                                            Danh mục
                                        </dt>

                                        <dd className="font-semibold text-slate-900">
                                            {equipment.category}
                                        </dd>
                                    </div>

                                    <div className="flex justify-between gap-4 py-3 text-sm">
                                        <dt className="text-slate-500">
                                            Chi nhánh
                                        </dt>

                                        <dd className="text-right font-semibold text-slate-900">
                                            {equipment.branch}
                                        </dd>
                                    </div>

                                    <div className="flex justify-between gap-4 py-3 text-sm">
                                        <dt className="text-slate-500">
                                            Đơn vị thuê
                                        </dt>

                                        <dd className="font-semibold text-slate-900">
                                            {equipment.rentalUnit}
                                        </dd>
                                    </div>

                                    <div className="flex justify-between gap-4 py-3 text-sm">
                                        <dt className="text-slate-500">
                                            Số lượng khả dụng
                                        </dt>

                                        <dd className="font-semibold text-slate-900">
                                            {equipment.availableQuantity}
                                        </dd>
                                    </div>
                                </dl>
                            </article>
                        </div>
                    )}

                    {activeTab === "SPECIFICATIONS" && (
                        <dl className="grid gap-3 sm:grid-cols-2">
                            {equipment.specifications.map(
                                (specification) => (
                                    <div
                                        key={specification.label}
                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <dt className="text-xs font-medium text-slate-500">
                                            {specification.label}
                                        </dt>

                                        <dd className="mt-2 text-sm font-semibold text-slate-900">
                                            {specification.value}
                                        </dd>
                                    </div>
                                ),
                            )}
                        </dl>
                    )}

                    {activeTab === "USAGE" && (
                        <div>
                            <div className="flex items-center gap-2">
                                <Wrench
                                    size={20}
                                    aria-hidden="true"
                                    className="text-blue-600"
                                />

                                <h2 className="text-base font-bold text-slate-950">
                                    Hướng dẫn sử dụng
                                </h2>
                            </div>

                            <ol className="mt-4 space-y-3">
                                {equipment.usageGuide.map(
                                    (guide, index) => (
                                        <li
                                            key={guide}
                                            className="flex gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-600"
                                        >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                        {index + 1}
                      </span>

                                            <span>{guide}</span>
                                        </li>
                                    ),
                                )}
                            </ol>
                        </div>
                    )}

                    {activeTab === "POLICY" && (
                        <div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck
                                    size={20}
                                    aria-hidden="true"
                                    className="text-blue-600"
                                />

                                <h2 className="text-base font-bold text-slate-950">
                                    Chính sách thuê
                                </h2>
                            </div>

                            <ul className="mt-4 space-y-3">
                                {equipment.rentalPolicy.map(
                                    (policy) => (
                                        <li
                                            key={policy}
                                            className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-600"
                                        >
                                            <CheckCircle2
                                                size={18}
                                                aria-hidden="true"
                                                className="mt-0.5 shrink-0 text-emerald-600"
                                            />

                                            <span>{policy}</span>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </section>

            <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                    <div className="flex items-center gap-2">
                        <MapPin
                            size={20}
                            aria-hidden="true"
                            className="text-blue-600"
                        />

                        <h2 className="text-base font-bold text-slate-950">
                            Địa điểm nhận thiết bị
                        </h2>
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-900">
                        {equipment.branch}
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {equipment.pickupAddress}
                    </p>
                </div>

                <div className="flex h-40 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    <div className="text-center">
                        <Image
                            size={26}
                            aria-hidden="true"
                            className="mx-auto"
                        />

                        <p className="mt-2 text-sm">
                            Bản đồ vị trí chi nhánh
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};