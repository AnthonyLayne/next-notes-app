import { KeyboardEvent } from "react";
// Utils
import { KEY } from "./constants";
import { getCircularIndex } from "./getCircularIndex";

// recieves the wrappingElement and elementsToFocus from updateFocusableElements(see below)
export const getFocusableElements = (
  wrappingElement: HTMLElement,
  elementsToFocus: (keyof HTMLElementTagNameMap)[]
) => {
  // This is our custom list of tabbable elements
  const allFocusableEl = [] as Maybe<HTMLElement>[];

  // Add the provided elements and then include everything with a non-negative tab index
  // button:not([tabindex="-1"]):not([disabled])
  const elementsList = elementsToFocus.reduce(
    (string, elementType) => `${string}${elementType}:not([tabindex="-1"]):not([disabled]),`,
    ""
  );

  // button:not([tabindex="-1"]):not([disabled]),[tabindex]:not([tabindex="-1"]):not([disabled])`
  const allFocusableList = wrappingElement.querySelectorAll(
    `${elementsList}[tabindex]:not([tabindex="-1"]):not([disabled])`
  );
  allFocusableList?.forEach((each) => allFocusableEl.push(each as HTMLElement));

  return allFocusableEl;
};

// recieves a wrappingElement returns
export const updateFocusableElements = (wrappingElement: HTMLDivElement) =>
  // recieves the wrapping element and the elements to focus
  getFocusableElements(wrappingElement, ["button", "a", "input", "select", "textarea"]);

// Type for handleKeyDown
type KeyDownType = {
  focusedIndex: number;
  allFocusableEl: Maybe<HTMLElement>[];
};

// recieves an event and an object
export const handleKeyDown = (event: KeyboardEvent, { focusedIndex, allFocusableEl }: KeyDownType) => {
  // takes the current idx, array of focusable elements and opts {}
  const upIndex = getCircularIndex(focusedIndex, allFocusableEl, { asc: false });
  const downIndex = getCircularIndex(focusedIndex, allFocusableEl, { asc: true });

  let newFocusedIndex = focusedIndex;

  switch (event.key) {
    // if pressing tab key
    case KEY.TAB: {
      // Prevent any other tab handlers from being able to change focus or handle the event
      event.stopPropagation();
      event.preventDefault();
      // if tab & shift, go back to prev tab idx
      if (event.shiftKey) {
        newFocusedIndex = upIndex;
      } else {
        // otherwise go to next idx
        newFocusedIndex = downIndex;
      }
      break;
    }
    default: {
      break;
    }
  }

  // if current idx is not the new index --> focus on the new index (tab to the next)
  if (focusedIndex !== newFocusedIndex) allFocusableEl[newFocusedIndex]?.focus();

  return newFocusedIndex;
};
