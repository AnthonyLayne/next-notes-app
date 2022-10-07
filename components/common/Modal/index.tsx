import { PropsWithChildren, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

// Utils
import { handleKeyDown, updateFocusableElements } from "utils/modalUtils";
import { getCSSNumberProperty } from "styles/utils";
import { useOpenStateHandler } from "hooks/useAnimatedOpenState";

// Constants
import { KEY } from "utils/modalUtils/constants";

// Styles
import cx from "classnames";
import styles from "./styles.module.css";

type TProps = PropsWithChildren<{
  isOpen: boolean;
  handleClose: VoidFunction;
  children: ReactNode;
  innerWrapperClassnames?: string;
}>;

export function Modal({ isOpen, children, handleClose, innerWrapperClassnames }: TProps) {
  const transitionTime = getCSSNumberProperty("--modalTransitionTime");

  const modalOverlayRef = useRef<HTMLDivElement>(null); // prints {current: null}
  const allFocusableEl = useRef<Maybe<HTMLElement>[]>([]); // prints {current: []}
  const [focusedIndex, setFocusedIndex] = useState(0);

  const bodyOverflowProperty = useRef<string>(""); // prints {current: ""}

  // useOpenStateHandler recieves isOpen: bool, opts: {}
  const openState = useOpenStateHandler(isOpen, { transitionTime, immediateOpen: false });
  // updates the elements that can be focused, sets the current focused index
  const setFocusableElements = useCallback(() => {
    // if modalOverlayRef.current---> set allFocusableEl.current -> to -> whatever html element
    if (modalOverlayRef.current) {
      // array of html tags
      allFocusableEl.current = updateFocusableElements(modalOverlayRef.current);
      // finds index of the focused html tag, updates the focused index
      const newIndex = allFocusableEl.current.findIndex((el) => el === document.activeElement);
      setFocusedIndex(newIndex);
    }
  }, [modalOverlayRef.current]);

  // This is to track mutations to the dom to keep the focusable elements list accurate
  const mutationObserver = useMemo(
    // Server-side rendering check
    // MutationObserver Watches for changes on the dom tree, if so, calls setFocusableElements, which updates the focusable/focused elements
    () => (typeof window !== "undefined" ? new MutationObserver(setFocusableElements) : undefined),
    []
  );

  useEffect(() => {
    // This is to prevent scrolling of the background while the modal is open
    const bodyStyle = document.body.style; // Object of CSS style declarations

    if (modalOverlayRef.current) {
      // if modalOverlayRef is truthy and openState truthy
      if (openState === "OPEN") {
        // Focus the overlay upon opening so that the esc key can close the modal...
        modalOverlayRef.current.focus();
        // ...and trap the focus for keyboard navigation...
        setFocusableElements();
        // ...and create an observer to listen for any dom changes to keep the focusable elements list accurate
        // observe --> targets a given node, recieves a target and options
        mutationObserver?.observe(modalOverlayRef.current, {
          subtree: true,
          childList: true,
          attributeFilter: ["tabindex"],
        });

        // When you open, save the current overflow property, if any...
        // The overflow property specifies whether to clip the content
        // or to add scrollbars when the content of an element is too big to fit in the specified area.
        bodyOverflowProperty.current = bodyStyle.overflow;
      } else if (openState === "CLOSED") {
        // ...and when you close, set the previous property back on the body
        bodyStyle.overflow = bodyOverflowProperty.current;
      }
    }

    return () => {
      // ...and if you navigate away before closing, set the previous property back on the body
      if (bodyStyle.overflow === "hidden") {
        bodyStyle.overflow = bodyOverflowProperty.current;
      }
      // Stops observer from observing any mutations. Until the observe() method is used again, observer's callback will not be invoked.
      mutationObserver?.disconnect();
    };
  }, [openState]);

  // closes the modal and stops propagation on click event, watches for handleClose
  const closeModal = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      handleClose();
    },
    [handleClose]
  );

  // closes modal if ESC key pressed, else sets new focused element during tabbing
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === KEY.ESC) {
        e.stopPropagation();
        handleClose();
      } else {
        const newFocusedIndex = handleKeyDown(e, { focusedIndex, allFocusableEl: allFocusableEl.current });
        setFocusedIndex(newFocusedIndex);
      }
    },
    [handleClose, focusedIndex, allFocusableEl.current, setFocusedIndex]
  );

  /* eslint-disable jsx-a11y/no-static-element-interactions */
  /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
  return (
    <div
      tabIndex={0}
      id="modal"
      ref={modalOverlayRef}
      onClick={closeModal}
      onKeyDown={onKeyDown}
      className={cx(styles.modalOverlay, {
        [styles.closing]: openState === "CLOSING",
        [styles.closed]: openState === "CLOSED",
        [styles.open]: openState === "OPEN",
      })}
    >
      {/* eslint-disable jsx-a11y/click-events-have-key-events */}
      <div onClick={(e) => e.stopPropagation()} className={innerWrapperClassnames}>
        <div>
          <button type="button" onClick={handleClose}>
            <h3>Close</h3>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
