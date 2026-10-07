import { useCallback, useEffect, useRef, useState } from "react";

export function useLiveData<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);
  const reload = useCallback(async () => {
    const current = ++generation.current;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await loader();
      if (current === generation.current) setData(result);
    } catch (reason) {
      if (current === generation.current)
        setError(
          reason instanceof Error ? reason.message : "Không thể tải dữ liệu.",
        );
    } finally {
      if (current === generation.current) setLoading(false);
    }
  }, [loader]);
  const invalidate = useCallback(() => { generation.current++; }, []);
  useEffect(() => {
    void reload();
    return invalidate;
  }, [reload, invalidate]);
  return { data, isLoading, error, reload };
}
