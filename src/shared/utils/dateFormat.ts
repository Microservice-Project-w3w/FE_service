// API dates can be missing on older records. Keep the page usable in that case.
export const createSafeDateFormatter = (
  locales?: Intl.LocalesArgument,
  options?: Intl.DateTimeFormatOptions,
) => {
  const formatter = new Intl.DateTimeFormat(locales, options);
  return {
    format(value?: Date | number): string {
      if (value === undefined || !Number.isFinite(Number(value))) {
        return "Chưa có thông tin";
      }
      return formatter.format(value);
    },
  };
};
