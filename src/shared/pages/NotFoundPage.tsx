import { Link } from "react-router";

export const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <p className="text-7xl font-bold text-blue-600">
        404
      </p>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Không tìm thấy trang
      </h1>

      <p className="mt-2 text-gray-500">
        Đường dẫn bạn truy cập không tồn tại.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white"
      >
        Quay lại tổng quan
      </Link>
    </main>
  );
};
