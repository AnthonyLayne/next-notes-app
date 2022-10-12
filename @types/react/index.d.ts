import React, { JSX } from "react";

declare module "react" {
  export interface CSSProperties extends React.CSSProperties {
    "--i"?: number;
    "--standardTransitionTime"?: string;
    "--modalTransitionTime"?: string;
    "--customColor"?: string;
    "--shrinkWidth"?: string;
  }
}
