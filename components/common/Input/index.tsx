import { memo, useCallback, useState } from "react";
import cx from "classnames";

// Types
import { InputProps, LabelProps } from "./types";

import styles from "./styles.module.css";

type TProps = InputProps & {
  labelText: string;
  labelProps?: LabelProps;
};

export const Input = memo(({ labelText, labelProps, autoComplete, ...inputProps }: TProps) => {
  const [emptyError, setEmptyError] = useState(false);

  const handleFocus = useCallback(() => setEmptyError(false), []);

  const handleBlur = useCallback(() => {
    if (inputProps.required && !inputProps.value) setEmptyError(true);
  }, [inputProps.required, inputProps.value]);

  return (
    <div className={styles.inputWrapper}>
      <input
        className={cx({ [styles.error]: emptyError })}
        placeholder=" "
        aria-required={inputProps.required}
        aria-label={labelText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...inputProps} // eslint-disable-line react/jsx-props-no-spreading
      />
      <label
        htmlFor={inputProps.id}
        {...labelProps} // eslint-disable-line react/jsx-props-no-spreading
      >
        {labelText}
        {inputProps.required && <sup>*</sup>}
      </label>
    </div>
  );
});
