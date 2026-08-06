import type {
    CustomerEquipment,
} from "../types/customerEquipment.types";

const COMMON_USAGE_GUIDE = [
    "Kiểm tra tình trạng thiết bị trước khi vận hành.",
    "Chỉ người đã được hướng dẫn mới được sử dụng thiết bị.",
    "Không tự ý tháo lắp hoặc sửa chữa thiết bị.",
    "Thông báo ngay cho chi nhánh khi phát hiện sự cố.",
];

const COMMON_RENTAL_POLICY = [
    "Giá thuê thực tế phụ thuộc vào thời gian và số lượng thuê.",
    "Khách hàng cần cung cấp giấy tờ xác minh khi nhận thiết bị.",
    "Thiết bị phải được hoàn trả đúng thời gian đã thỏa thuận.",
    "Chi phí hư hỏng được xác định theo biên bản bàn giao.",
];

export const CUSTOMER_EQUIPMENT_MOCKS:
    CustomerEquipment[] = [
    {
        id: "1",
        code: "EQ-2505-001",
        name: "Máy xúc Komatsu PC200-8",
        category: "Máy công trình",
        branch: "Chi nhánh Hà Nội",
        pricePerDay: 1500000,
        imageUrl:
            "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?auto=format&fit=crop&w=1200&q=80",
        status: "AVAILABLE",
        availableQuantity: 5,
        availabilityReason: "IN_STOCK",
        description:
            "Máy xúc Komatsu PC200-8 là dòng máy đào thủy lực có khả năng vận hành ổn định, phù hợp cho công trình xây dựng, san lấp mặt bằng và đào móng.",
        features: [
            "Khả năng đào và nâng tải tốt",
            "Vận hành ổn định trên nhiều địa hình",
            "Cabin rộng và dễ quan sát",
            "Tiết kiệm nhiên liệu",
        ],
        specifications: [
            {
                label: "Mã thiết bị",
                value: "EQ-2505-001",
            },
            {
                label: "Trọng lượng vận hành",
                value: "Khoảng 20 tấn",
            },
            {
                label: "Dung tích gầu",
                value: "0,8 - 1,0 m³",
            },
            {
                label: "Công suất",
                value: "Khoảng 155 HP",
            },
            {
                label: "Đơn vị thuê",
                value: "Theo ngày",
            },
        ],
        galleryImages: [],
        pickupAddress:
            "123 Phạm Văn Đồng, Cầu Giấy, Hà Nội",
        rentalUnit: "Theo ngày",
        usageGuide: COMMON_USAGE_GUIDE,
        rentalPolicy: COMMON_RENTAL_POLICY,
    },
    {
        id: "2",
        code: "EQ-2505-002",
        name: "Xe nâng Heli CPCD30",
        category: "Thiết bị nâng",
        branch: "Chi nhánh Hà Nội",
        pricePerDay: 800000,
        imageUrl:
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        status: "AVAILABLE",
        availableQuantity: 4,
        availabilityReason: "IN_STOCK",
        description:
            "Xe nâng Heli CPCD30 phù hợp cho hoạt động nâng hạ và di chuyển hàng hóa trong kho, bãi tập kết và khu vực sản xuất.",
        features: [
            "Tải trọng nâng khoảng 3 tấn",
            "Khả năng quay đầu linh hoạt",
            "Phù hợp kho bãi và nhà xưởng",
            "Dễ vận hành và bảo trì",
        ],
        specifications: [
            {
                label: "Mã thiết bị",
                value: "EQ-2505-002",
            },
            {
                label: "Tải trọng nâng",
                value: "3.000 kg",
            },
            {
                label: "Chiều cao nâng",
                value: "Khoảng 3 mét",
            },
            {
                label: "Nhiên liệu",
                value: "Dầu diesel",
            },
            {
                label: "Đơn vị thuê",
                value: "Theo ngày",
            },
        ],
        galleryImages: [],
        pickupAddress:
            "123 Phạm Văn Đồng, Cầu Giấy, Hà Nội",
        rentalUnit: "Theo ngày",
        usageGuide: COMMON_USAGE_GUIDE,
        rentalPolicy: COMMON_RENTAL_POLICY,
    },
    {
        id: "3",
        code: "EQ-2505-003",
        name: "Máy phát điện Denyo 45kVA",
        category: "Máy phát điện",
        branch: "Chi nhánh Đà Nẵng",
        pricePerDay: 1200000,
        imageUrl:
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        status: "AVAILABLE",
        availableQuantity: 3,
        availabilityReason: "IN_STOCK",
        description:
            "Máy phát điện Denyo 45kVA cung cấp nguồn điện dự phòng ổn định cho công trường, sự kiện và khu vực chưa có nguồn điện cố định.",
        features: [
            "Công suất phù hợp công trình vừa",
            "Độ ồn thấp khi vận hành",
            "Nguồn điện đầu ra ổn định",
            "Tiết kiệm nhiên liệu",
        ],
        specifications: [
            {
                label: "Mã thiết bị",
                value: "EQ-2505-003",
            },
            {
                label: "Công suất",
                value: "45 kVA",
            },
            {
                label: "Điện áp",
                value: "220V / 380V",
            },
            {
                label: "Nhiên liệu",
                value: "Dầu diesel",
            },
            {
                label: "Đơn vị thuê",
                value: "Theo ngày",
            },
        ],
        galleryImages: [],
        pickupAddress:
            "86 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
        rentalUnit: "Theo ngày",
        usageGuide: COMMON_USAGE_GUIDE,
        rentalPolicy: COMMON_RENTAL_POLICY,
    },
    {
        id: "4",
        code: "EQ-2505-004",
        name: "Giàn giáo nêm Ringlock",
        category: "Giàn giáo",
        branch: "Chi nhánh Hà Nội",
        pricePerDay: 150000,
        imageUrl:
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
        status: "LOW_STOCK",
        availableQuantity: 2,
        availabilityReason: "LOW_QUANTITY",
        description:
            "Giàn giáo nêm Ringlock có kết cấu chắc chắn, lắp dựng nhanh và phù hợp cho nhiều loại công trình.",
        features: [
            "Kết cấu chắc chắn và an toàn",
            "Lắp đặt, tháo dỡ nhanh",
            "Linh hoạt theo chiều cao",
            "Phù hợp nhiều loại mặt bằng",
        ],
        specifications: [
            {
                label: "Mã thiết bị",
                value: "EQ-2505-004",
            },
            {
                label: "Loại giàn giáo",
                value: "Giàn giáo nêm",
            },
            {
                label: "Vật liệu",
                value: "Thép mạ kẽm",
            },
            {
                label: "Số lượng khả dụng",
                value: "2 bộ",
            },
            {
                label: "Đơn vị thuê",
                value: "Theo bộ/ngày",
            },
        ],
        galleryImages: [],
        pickupAddress:
            "123 Phạm Văn Đồng, Cầu Giấy, Hà Nội",
        rentalUnit: "Theo bộ/ngày",
        usageGuide: COMMON_USAGE_GUIDE,
        rentalPolicy: COMMON_RENTAL_POLICY,
    },
    {
        id: "5",
        code: "EQ-2505-005",
        name: "Xe nâng người Genie S-60",
        category: "Thiết bị nâng",
        branch: "Chi nhánh TP.HCM",
        pricePerDay: 1100000,
        imageUrl:
            "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=80",
        status: "AVAILABLE",
        availableQuantity: 3,
        availabilityReason: "IN_STOCK",
        description:
            "Xe nâng người Genie S-60 hỗ trợ thi công trên cao, lắp đặt hệ thống và bảo trì nhà xưởng.",
        features: [
            "Làm việc an toàn trên cao",
            "Khả năng vươn xa linh hoạt",
            "Sàn thao tác rộng",
            "Hệ thống điều khiển dễ sử dụng",
        ],
        specifications: [
            {
                label: "Mã thiết bị",
                value: "EQ-2505-005",
            },
            {
                label: "Chiều cao làm việc",
                value: "Khoảng 20 mét",
            },
            {
                label: "Tải trọng sàn",
                value: "Khoảng 227 kg",
            },
            {
                label: "Nhiên liệu",
                value: "Dầu diesel",
            },
            {
                label: "Đơn vị thuê",
                value: "Theo ngày",
            },
        ],
        galleryImages: [],
        pickupAddress:
            "45 Xa lộ Hà Nội, Thủ Đức, TP.HCM",
        rentalUnit: "Theo ngày",
        usageGuide: COMMON_USAGE_GUIDE,
        rentalPolicy: COMMON_RENTAL_POLICY,
    },
    {
        id: "6",
        code: "EQ-2505-006",
        name: "Máy lu Hamm HD75",
        category: "Máy công trình",
        branch: "Chi nhánh Hà Nội",
        pricePerDay: 1350000,
        imageUrl:
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
        status: "UNAVAILABLE",
        availableQuantity: 0,
        availabilityReason: "MAINTENANCE",
        description:
            "Máy lu Hamm HD75 được sử dụng để đầm nén nền đường, mặt bằng và các lớp vật liệu trong thi công hạ tầng.",
        features: [
            "Khả năng đầm nén ổn định",
            "Phù hợp thi công đường bộ",
            "Cabin quan sát thuận tiện",
            "Vận hành bền bỉ",
        ],
        specifications: [
            {
                label: "Mã thiết bị",
                value: "EQ-2505-006",
            },
            {
                label: "Trọng lượng vận hành",
                value: "Khoảng 7,5 tấn",
            },
            {
                label: "Chiều rộng lu",
                value: "Khoảng 1,68 mét",
            },
            {
                label: "Tình trạng",
                value: "Đang bảo trì",
            },
            {
                label: "Đơn vị thuê",
                value: "Theo ngày",
            },
        ],
        galleryImages: [],
        pickupAddress:
            "123 Phạm Văn Đồng, Cầu Giấy, Hà Nội",
        rentalUnit: "Theo ngày",
        usageGuide: COMMON_USAGE_GUIDE,
        rentalPolicy: COMMON_RENTAL_POLICY,
    },
];