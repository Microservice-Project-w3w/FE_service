import type {
  StoredAuthUser,
} from "@/modules/auth/types/auth.types";

export const defaultMockUsers: StoredAuthUser[] = [
  {
    id: "admin-001",
    fullName: "Quản trị viên",
    email: "admin123@gmail.com",
    phone: "0900000000",
    password: "12345678",
    accountType: "business",
    role: "ADMIN",
    companyName: "RentAI Manager",
    taxCode: "0101234567",
  },
];
