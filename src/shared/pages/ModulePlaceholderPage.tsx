interface ModulePlaceholderPageProps {
  title: string;
  description: string;
}

export const ModulePlaceholderPage = ({
  title,
  description,
}: ModulePlaceholderPageProps) => {
  return (
    <section>
      <header>
        <h1 className="text-2xl font-bold text-gray-950">
          {title}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {description}
        </p>
      </header>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="font-medium text-gray-700">
          Module đang được xây dựng
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Giao diện chi tiết sẽ được triển khai theo thiết kế của team.
        </p>
      </div>
    </section>
  );
};
