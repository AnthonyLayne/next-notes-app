import { CSSProperties } from "react";

export const getCSSNumberProperty = (property: keyof CSSProperties) =>
  Number(
    // SSR Check
    typeof window !== "undefined" ? getComputedStyle(document.body).getPropertyValue(property).replace(/\D+/g, "") : 0
  );
