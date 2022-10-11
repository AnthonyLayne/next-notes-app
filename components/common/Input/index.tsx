import { useState, memo, ChangeEvent, FocusEvent } from "react";
import cx from "classnames";

// Helpers
import { useDidUpdate } from "hooks/useDidUpdate";

// Types
import {
  InputAutocompleteType,
  InputTypeProp,
  DefaultType,
  RequiredDefaultTypes,
  BaseInputProps,
  BaseTextAreaProps,
} from "./types";

import styles from "./styles.module.css";

type TProps = RequiredDefaultTypes & {
  // Replaced Types (including `RequiredDefaultTypes`)
  ariaLabel: DefaultType["aria-label"];
  required?: DefaultType["required"];
  disabled?: DefaultType["disabled"];
  placeholder?: DefaultType["placeholder"];
  autoComplete?: InputAutocompleteType;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

  // Custom Types
  className?: string;
  label?: JSX.Element | string;
  hideMaxLengthIndicator?: boolean;
  maxLength?: number;
  resetErrorTracker?: number;
  showBorder?: boolean;
  hasError?: boolean;
  /**
   * Use this if you want to shrink the label permanently (as if there were text in the input).
   * (For example, if there is placeholder text.)
   */
  shrinkLabel?: boolean;
} & (
    | {
        input: { type: InputTypeProp; props?: BaseInputProps; min?: string | number; max?: string | number };
        textarea?: undefined;
      }
    | { textarea: { props?: BaseTextAreaProps; rows?: number; preventResize?: boolean }; input?: undefined }
  );

export const Input = memo(
  ({
    // Required Props
    id,
    name,
    value,
    ariaLabel,

    // Custom Props
    className,
    label,
    hideMaxLengthIndicator,
    maxLength,
    resetErrorTracker,
    showBorder,
    hasError,
    shrinkLabel,

    // Default Props
    required,
    disabled,
    autoComplete,
    placeholder,
    onBlur,
    onFocus,
    onChange,

    // `input` vs `textarea` props
    textarea,
    input,
  }: TProps) => {
    const [emptyError, setError] = useState(false);

    const isEmpty = !value || !String(value).length;
    const showEmptyError = required && emptyError;

    // Sometimes (such as in the case of modals), the input will reset without unmounting.
    // Incrementing this allows the parent to clear the error state.
    useDidUpdate(() => {
      setError(false);
    }, [resetErrorTracker]);

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (isEmpty) setError(true);
      onBlur?.(e);
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setError(false);
      onFocus?.(e);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (maxLength !== undefined && e.target.value.length > maxLength) {
        e.target.value = e.target.value.slice(0, maxLength);
      }

      onChange?.(e);
    };

    return (
      <div
        className={cx(
          styles.inputWrapper,
          {
            [styles.error]: showEmptyError || hasError,
            [styles.isDisabled]: disabled,
            [styles.shrink]: input?.type === "date" || shrinkLabel,
            [styles.showBorder]: showBorder,
          },
          className
        )}
      >
        {textarea ? (
          <textarea
            style={textarea.preventResize ? { resize: "none" } : {}}
            id={id}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            aria-label={ariaLabel}
            autoComplete={autoComplete}
            placeholder={placeholder || " "}
            disabled={disabled}
            maxLength={maxLength}
            rows={textarea.rows}
            {...textarea.props} // eslint-disable-line react/jsx-props-no-spreading
          />
        ) : (
          <input
            defaultValue={input.props?.defaultValue}
            id={id}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            type={input.type}
            aria-label={ariaLabel}
            autoComplete={autoComplete}
            maxLength={maxLength}
            placeholder={placeholder || " "}
            pattern={input.props?.pattern}
            disabled={disabled}
            min={input.props?.min} // for date fields
            max={input.props?.max} // for date fields
            {...input.props} // eslint-disable-line react/jsx-props-no-spreading
          />
        )}
        <label className={styles.label} htmlFor={id}>
          {label}
          {required && <sup>*</sup>}
        </label>
        {!hideMaxLengthIndicator && maxLength && typeof value === "string" && (
          <span
            className={cx(styles.remainingChars, { [styles.maxed]: value.length >= maxLength })}
          >{`${value.length}/${maxLength}`}</span>
        )}
      </div>
    );
  }
);
