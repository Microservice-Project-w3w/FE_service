import {
    ArrowLeft,
} from "lucide-react";
import {
    useEffect,
    useState,
} from "react";
import {
    Link,
    Navigate,
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

    const { equipmentId } = useParams<{
        equipmentId: string;
    }>();

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

    const canCreateRequest =
        equipment.status !== "UNAVAILABLE" &&
        equipment.availableQuantity > 0;

    if (!canCreateRequest) {
        return (
            <Navigate
                to="/customer/equipment"
                replace
            />
        );
    }

    const handleCancel = (): void => {
        navigate("/customer/equipment");
    };

    const handleSubmit = async (
        values: CustomerRentalRequestSchema,
    ): Promise<void> => {
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
                to="/customer/equipment"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
                <ArrowLeft
                    size={18}
                    aria-hidden="true"
                />

                Quay lại danh sách thiết bị
            </Link>

            <header>
                <h1 className="text-3xl font-bold text-slate-950">
                    Yêu cầu thuê thiết bị
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Nhập thông tin thuê và kiểm tra chi phí
                    dự kiến trước khi gửi yêu cầu.
                </p>
            </header>

            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <CustomerRentalRequestForm
                    branchName={
                        equipment.branch
                    }
                    availableQuantity={
                        equipment.availableQuantity
                    }
                    isSubmitting={
                        isSubmitting
                    }
                    onCancel={handleCancel}
                    onPreviewChange={
                        setPreview
                    }
                    onSubmit={handleSubmit}
                />

                <CustomerRentalRequestSummary
                    equipment={equipment}
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
        </main>
    );
};