import { CSSProperties } from "react";

export const getCSSNumberProperty = (property: keyof CSSProperties, element?: Nullable<Element>) => {
  // SSR Check
  if (typeof window === "undefined") return 0;

  const prop = getComputedStyle(element || document.body).getPropertyValue(property);
  const match = prop.match(/[\d.]+/g) || [0];

  return Number(match[0]);
};

export const getCSSStringProperty = (property: keyof CSSProperties, element?: Nullable<Element>) =>
  // SSR Check
  typeof window !== "undefined" ? getComputedStyle(element || document.body).getPropertyValue(property) : "";
