import { memo, useRef, useEffect, useState, PropsWithChildren, DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import cx from "classnames";

// Helpers
import { blackOrWhiteFromBackground } from "utils/format";

import styles from "./styles.module.css";

type DefaultButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

type ButtonProps = Omit<DefaultButtonProps, "type"> & { type: "submit" | "reset" | "button" };

type TProps = PropsWithChildren<
  ButtonProps & {
    version: "primaryGhost" | "secondaryGhost" | "blackGhost" | "whiteGhost" | "ghost" | "primary" | "secondary";
  }
>;

const VERSION_MAP = {
  primaryGhost: "transparent",
  secondaryGhost: "transparent",
  blackGhost: "transparent",
  whiteGhost: "transparent",
  ghost: "transparent",
  primary: "var(--primaryColor)",
  secondary: "var(--secondaryColor)",
};

export const Button = memo(({ version, children, className, ...buttonProps }: TProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [textColor, setTextColor] = useState("black");

  useEffect(() => {
    const backgroundColor = VERSION_MAP[version];

    // If the background is transparent, set the text color to black
    if (backgroundColor === "transparent") setTextColor("var(--darkBlack)");
    // Otherwise set it based on the calculation
    else setTextColor(blackOrWhiteFromBackground(backgroundColor, "rgb"));
  }, [version]);

  return (
    <button
      ref={buttonRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...buttonProps}
      // eslint-disable-next-line react/button-has-type
      type={buttonProps.type}
      className={cx(styles.button, styles[version], className)}
      style={{ "--customColor": textColor, backgroundColor: VERSION_MAP[version] }}
    >
      {children}
    </button>
  );
});
