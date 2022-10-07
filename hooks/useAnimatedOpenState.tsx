import { useRef, useState, useLayoutEffect, useCallback } from "react";

export type OpenStates = "CLOSING" | "CLOSED" | "OPENING" | "OPEN";
type Options = Maybe<{
  initialState?: OpenStates;
  transitionTime?: number;
  immediateOpen?: boolean;
  immediateClose?: boolean;
}>;

/**
 * This hook allows opening and closing to be broken from two into four stages, allowing the developer to slide animations in.
 * For example, if you want a modal to fade into view, it must first render invisibly, then fade into view. To close, it must
 * fade out of view, then must stop rendering.
 * @param initialState - The initial state of the element
 * @param transitionTime - The transition time of the desired animation, imported from the sass variable, in milliseconds
 * @param immediateOpen - Determines whether `OPENING` progresses to `OPEN` immediately or after the transition time
 * @param immediateClose - Determines whether `CLOSING` progresses to `CLOSED` immediately or after the transition time
 */

export const useAnimatedOpenState = ({
  initialState = "CLOSED",
  transitionTime = 200,
  immediateOpen = false,
  immediateClose = false,
}: Options = {}) => {
  const timeout = useRef<Maybe<NodeJS.Timeout>>(); // {current: undefined}

  const [openState, setOpenState] = useState<OpenStates>(initialState);

  // OPEN - arrow function that calls setOpenState, passes it a ternary, checks if the prev state was closed or closing, if so sets to opening else prev.
  // in this case as the code is rn the initial state is CLOSED, the arr includes Closed, so sets state to OPENING.
  const open = useCallback(() => setOpenState((prev) => (["CLOSED", "CLOSING"].includes(prev) ? "OPENING" : prev)), []);

  // if open or opening is prev state, then it sets state to closing.
  const close = useCallback(() => setOpenState((prev) => (["OPEN", "OPENING"].includes(prev) ? "CLOSING" : prev)), []);

  // if prev state  is Closed OR Closing is sets state to OPENING, otherwise sets to CLOSING
  const toggle = useCallback(
    () => setOpenState((prev) => (prev === "CLOSED" || prev === "CLOSING" ? "OPENING" : "CLOSING")),
    []
  );

  // like a useEffect, but fires after any dom manipulation
  useLayoutEffect(() => {
    // timeout.current is undefined before being set (see above), so it will skip this line if undefined
    if (timeout.current) clearTimeout(timeout.current);

    // if immediate open is set to false above, so openDelay will be transitionTime (in Milliseconds)
    const openDelay = immediateOpen ? 0 : transitionTime;

    // if immediateClose is set to false above, so closeDelay will be transitionTime (in Milliseconds)
    const closeDelay = immediateClose ? 0 : transitionTime;

    // setTimeout(function, delay) sets a timer(and stores the timer id) then executes code once the timer runs out
    // after 200ms sets the state from OPENING to OPEN (if the openstate is equal to OPENING)
    if (openState === "OPENING") timeout.current = setTimeout(() => setOpenState("OPEN"), openDelay);
    // (if openState is equal to CLOSING) sets the openState to Closed after 200ms
    if (openState === "CLOSING") timeout.current = setTimeout(() => setOpenState("CLOSED"), closeDelay);
    // if openState changes useLayoutEffect will rerun
  }, [openState]);
  // useAnimatedOpenState returns stateful values
  return { openState, open, close, toggle } as const;
};

/**
 * The utilizing controller should still trigger open and close using functions at the parent level.
 * This simply recieves those top-level commands and breaks them down into staggered, animated open states.
 * @param isOpen - The binary open state to be transformed into a four-stage state (OPEN, OPENING, CLOSED, CLOSING)
 * @param transitionTime - The transition time of the desired animation, imported from the sass variable, in milliseconds
 * @param immediateOpen - Determines whether `OPENING` progresses to `OPEN` immediately or after the transition time
 * @param immediateClose - Determines whether `CLOSING` progresses to `CLOSED` immediately or after the transition time
 */

// recieves two parameters isOpen and an options {}
export const useOpenStateHandler = (
  isOpen: boolean,
  { transitionTime = 200, immediateOpen = false, immediateClose = false }: Options = {}
) => {
  // destructuring {openState, open, close} from useAnimatedOpenState (see above)
  // useAnimatedOpenState is recieving initialState, transitionTime, immediateOpen, immediateClose

  // isOpen and options passed to useOpenStateHandler, options get passed to useAnimatedOpenState, openState, open and close get
  // destructured from useAnimatedOpenState, then the modal is open or closed based on isOpen
  const {
    openState: visibleState,
    open,
    close,
  } = useAnimatedOpenState({
    initialState: isOpen ? "OPEN" : "CLOSED",
    transitionTime,
    immediateOpen,
    immediateClose,
  });
  // checks isOpen, if true open, if false close
  useLayoutEffect(() => {
    if (isOpen) open();
    else close();
  }, [isOpen]);
  // returns openState
  return visibleState;
};
