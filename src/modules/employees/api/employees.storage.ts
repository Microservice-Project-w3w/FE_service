import {
  mockEmployees,
} from "@/modules/employees/mocks/employees.mock";

import type {
  Employee,
} from "@/modules/employees/types/employee.types";

const EMPLOYEES_STORAGE_KEY =
  "rentai_mock_employees_v1";

const cloneEmployees = (
  employees: Employee[],
): Employee[] => {
  return employees.map(
    (employee) => ({
      ...employee,
    }),
  );
};

const canUseLocalStorage = (): boolean => {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !==
      "undefined"
  );
};

export const readStoredEmployees =
  (): Employee[] => {
    if (!canUseLocalStorage()) {
      return cloneEmployees(
        mockEmployees,
      );
    }

    try {
      const rawValue =
        window.localStorage.getItem(
          EMPLOYEES_STORAGE_KEY,
        );

      if (!rawValue) {
        const initialEmployees =
          cloneEmployees(
            mockEmployees,
          );

        window.localStorage.setItem(
          EMPLOYEES_STORAGE_KEY,
          JSON.stringify(
            initialEmployees,
          ),
        );

        return initialEmployees;
      }

      const parsedValue: unknown =
        JSON.parse(rawValue);

      if (
        !Array.isArray(parsedValue)
      ) {
        throw new Error(
          "Dữ liệu nhân viên không hợp lệ.",
        );
      }

      return cloneEmployees(
        parsedValue as Employee[],
      );
    } catch {
      const initialEmployees =
        cloneEmployees(
          mockEmployees,
        );

      window.localStorage.setItem(
        EMPLOYEES_STORAGE_KEY,
        JSON.stringify(
          initialEmployees,
        ),
      );

      return initialEmployees;
    }
  };

export const writeStoredEmployees = (
  employees: Employee[],
): void => {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(
    EMPLOYEES_STORAGE_KEY,
    JSON.stringify(employees),
  );
};

export const resetStoredEmployees =
  (): Employee[] => {
    const initialEmployees =
      cloneEmployees(
        mockEmployees,
      );

    writeStoredEmployees(
      initialEmployees,
    );

    return initialEmployees;
  };
