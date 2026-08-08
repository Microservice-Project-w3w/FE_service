import {
    ArrowLeft,
    Package,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router";

import {
    CustomerRentalRequestForm,
} from "../components/CustomerRentalRequestForm";
import {
    CustomerRentalRequestSummary,
} from "../components/CustomerRentalRequestSummary";
import {
    CUSTOMER_EQUIPMENT_MOCKS,
} from "../mocks/customerEquipment.mock";
import type {
    CustomerRentalRequestSchema,
} from "../schemas/customerRentalRequest.schema";

interface RentalRequestPreview {
    startDate: string;
    endDate: string;
    quantity: number;
}

export const CustomerRentalRequestCreatePage = () => {
    const navigate = useNavigate();

    const {
        equipmentId,
    } = useParams<{
        equipmentId?: string;
    }>();

    const rentableEquipments = useMemo(
        () =>
            CUSTOMER_EQUIPMENT_MOCKS.filter(
                (equipment) =>
                    equipment.status !==
                    "UNAVAILABLE" &&
                    equipment.availableQuantity >
                    0,
            ),
        [],
    );

    const routeEquipment =
        useMemo(
            () =>
                equipmentId
                    ? rentableEquipments.find(
                        (equipment) =>
                            equipment.id ===
                            equipmentId,
                    )
                    : undefined,
            [
                equipmentId,
                rentableEquipments,
            ],
        );

    const [
        selectedEquipmentId,
        setSelectedEquipmentId,
    ] = useState(
        routeEquipment?.id ??
        rentableEquipments[0]?.id ??
        "",
    );

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        preview,
        setPreview,
    ] = useState<RentalRequestPreview>({
        startDate: "",
        endDate: "",
        quantity: 1,
    });

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    }, []);

    useEffect(() => {
        if (routeEquipment) {
            setSelectedEquipmentId(
                routeEquipment.id,
            );
        }
    }, [routeEquipment]);

    const equipment =
        useMemo(
            () =>
                rentableEquipments.find(
                    (item) =>
                        item.id ===
                        selectedEquipmentId,
                ) ?? null,
            [
                rentableEquipments,
                selectedEquipmentId,
            ],
        );

    const isCreatedFromEquipment =
        Boolean(equipmentId);

    const backPath =
        isCreatedFromEquipment
            ? "/customer/equipment"
            : "/customer/rental-requests";

    const backLabel =
        isCreatedFromEquipment
            ? "Quay lại danh sách thiết bị"
            : "Quay lại yêu cầu thuê của tôi";

    const handleEquipmentChange = (
        nextEquipmentId: string,
    ): void => {
        setSelectedEquipmentId(
            nextEquipmentId,
        );

        setPreview({
            startDate: "",
            endDate: "",
            quantity: 1,
        });
    };

    const handleCancel = (): void => {
        navigate(backPath);
    };

    const handleSubmit = async (
        values: CustomerRentalRequestSchema,
    ): Promise<void> => {
        if (!equipment) {
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                equipmentId: equipment.id,
                ...values,
            };

            console.log(
                "Rental request payload:",
                payload,
            );

            await new Promise<void>(
                (resolve) => {
                    window.setTimeout(
                        resolve,
                        700,
                    );
                },
            );

            navigate(
                "/customer/rental-requests",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="space-y-6">
            <Link
                to={backPath}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
                <ArrowLeft
                    size={18}
                    aria-hidden="true"
                />

                {backLabel}
            </Link>

            <header>
                <h1 className="text-3xl font-bold text-slate-950">
                    Tạo yêu cầu thuê
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Chọn thiết bị, nhập thông tin thuê và
                    kiểm tra chi phí dự kiến trước khi gửi
                    yêu cầu.
                </p>
            </header>

            {rentableEquipments.length ===
            0 ? (
                <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                    <Package
                        size={36}
                        aria-hidden="true"
                        className="mx-auto text-slate-400"
                    />

                    <h2 className="mt-4 text-base font-bold text-slate-900">
                        Hiện chưa có thiết bị có thể thuê
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Vui lòng quay lại sau hoặc kiểm tra
                        danh sách thiết bị.
                    </p>

                    <Link
                        to="/customer/equipment"
                        className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Xem danh sách thiết bị
                    </Link>
                </section>
            ) : (
                <>
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Package
                                    size={18}
                                    aria-hidden="true"
                                />
                            </span>

                            <div>
                                <h2 className="text-base font-bold text-slate-950">
                                    Chọn thiết bị thuê
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Chỉ hiển thị các thiết bị
                                    hiện đang có thể thuê.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.75fr)]">
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">
                                    Thiết bị
                                </span>

                                <select
                                    value={
                                        selectedEquipmentId
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                    onChange={(
                                        event,
                                    ) => {
                                        handleEquipmentChange(
                                            event
                                                .target
                                                .value,
                                        );
                                    }}
                                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
                                >
                                    {rentableEquipments.map(
                                        (item) => (
                                            <option
                                                key={
                                                    item.id
                                                }
                                                value={
                                                    item.id
                                                }
                                            >
                                                {
                                                    item.name
                                                }{" "}
                                                -{" "}
                                                {
                                                    item.code
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>
                            </label>

                            {equipment && (
                                <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                                    <p className="text-sm font-bold text-slate-950">
                                        {
                                            equipment.name
                                        }
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {
                                            equipment.code
                                        }{" "}
                                        •{" "}
                                        {
                                            equipment.branch
                                        }
                                    </p>

                                    <p className="mt-2 text-xs font-semibold text-emerald-700">
                                        Còn{" "}
                                        {
                                            equipment.availableQuantity
                                        }{" "}
                                        thiết bị có thể thuê
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {equipment && (
                        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                            <CustomerRentalRequestForm
                                key={
                                    equipment.id
                                }
                                branchName={
                                    equipment.branch
                                }
                                availableQuantity={
                                    equipment.availableQuantity
                                }
                                isSubmitting={
                                    isSubmitting
                                }
                                onCancel={
                                    handleCancel
                                }
                                onPreviewChange={
                                    setPreview
                                }
                                onSubmit={
                                    handleSubmit
                                }
                            />

                            <CustomerRentalRequestSummary
                                equipment={
                                    equipment
                                }
                                startDate={
                                    preview.startDate
                                }
                                endDate={
                                    preview.endDate
                                }
                                quantity={
                                    preview.quantity
                                }
                            />
                        </div>
                    )}
                </>
            )}
        </main>
    );
};