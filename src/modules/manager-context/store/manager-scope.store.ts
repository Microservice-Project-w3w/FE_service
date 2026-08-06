import {
  create,
} from "zustand";

import type {
  ManagerAccessContext,
  ManagerScopeId,
} from "@/modules/manager-context/types/manager-context.types";

interface ManagerScopeState {
  accessContext:
    ManagerAccessContext | null;

  selectedScopeId:
    ManagerScopeId;

  setAccessContext: (
    accessContext:
      ManagerAccessContext,
  ) => void;

  setSelectedScopeId: (
    scopeId: ManagerScopeId,
  ) => void;

  resetManagerScope: () => void;
}

export const useManagerScopeStore =
  create<ManagerScopeState>(
    (set, get) => ({
      accessContext: null,
      selectedScopeId: "ALL",

      setAccessContext: (
        accessContext,
      ) => {
        const currentScopeId =
          get().selectedScopeId;

        const isCurrentScopeValid =
          currentScopeId === "ALL" ||
          accessContext.assignedBranches
            .some(
              (branch) =>
                branch.id ===
                currentScopeId,
            );

        set({
          accessContext,
          selectedScopeId:
            isCurrentScopeValid
              ? currentScopeId
              : "ALL",
        });
      },

      setSelectedScopeId: (
        scopeId,
      ) => {
        const accessContext =
          get().accessContext;

        if (scopeId === "ALL") {
          set({
            selectedScopeId:
              scopeId,
          });
          return;
        }

        const hasBranch =
          accessContext
            ?.assignedBranches.some(
              (branch) =>
                branch.id ===
                scopeId,
            ) ?? false;

        if (!hasBranch) {
          return;
        }

        set({
          selectedScopeId:
            scopeId,
        });
      },

      resetManagerScope: () => {
        set({
          accessContext: null,
          selectedScopeId: "ALL",
        });
      },
    }),
  );
