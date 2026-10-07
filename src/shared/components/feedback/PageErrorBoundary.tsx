import { Component, type ErrorInfo, type ReactNode } from "react";

export class PageErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Không thể hiển thị trang", error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return (
        <section
          role="alert"
          className="mx-auto my-8 max-w-xl rounded-2xl border border-rose-200 bg-white p-6"
        >
          <h1 className="text-lg font-bold text-slate-900">
            Không thể hiển thị trang
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Trang gặp lỗi khi xử lý dữ liệu. Bạn có thể tải lại hoặc quay về để
            tiếp tục sử dụng.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white"
              onClick={() => window.location.reload()}
            >
              Tải lại trang
            </button>
            <a
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700"
              href="/"
            >
              Về trang chính
            </a>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
