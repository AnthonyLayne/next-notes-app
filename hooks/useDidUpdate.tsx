import { useRef, useEffect, EffectCallback, DependencyList } from "react";

export const useDidUpdate = (fn: EffectCallback, deps: DependencyList) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, deps);
};
