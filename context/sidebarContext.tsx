import { createContext, ReactNode, Dispatch, SetStateAction, useMemo, useState, useCallback } from "react";

// Helpers
import { useSafeContext } from "context/useSafeContext";

export type BaseSidebarContext = {
  sidebarExpanded: boolean;
  setSidebarExpanded: Dispatch<SetStateAction<boolean>>;
  toggleSidebar: VoidFunction;
  expandSidebar: VoidFunction;
  closeSidebar: VoidFunction;
};

const SidebarContext = createContext<Maybe<BaseSidebarContext>>(undefined);
SidebarContext.displayName = "SidebarContext";

export const useSidebarContext = () => useSafeContext(SidebarContext);

type TProps = {
  children: ReactNode;
};

export function SidebarContextProviderComponent({ children }: TProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = useCallback(() => setSidebarExpanded((prev) => !prev), []);
  const expandSidebar = useCallback(() => setSidebarExpanded(true), []);
  const closeSidebar = useCallback(() => setSidebarExpanded(false), []);

  const ctx = useMemo(
    () => ({
      sidebarExpanded,
      setSidebarExpanded,
      toggleSidebar,
      expandSidebar,
      closeSidebar,
    }),
    [sidebarExpanded]
  );

  return <SidebarContext.Provider value={ctx}>{children}</SidebarContext.Provider>;
}
