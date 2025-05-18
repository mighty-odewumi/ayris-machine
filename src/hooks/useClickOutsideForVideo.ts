"use client"

import { useEffect, useRef, type RefObject } from "react"

export function useClickOutsideForVideo<T extends HTMLElement>(ref: RefObject<T>, handler: () => void, deps: any[] = []) {
  const depsRef = useRef(deps);
  
  useEffect(() => {
    depsRef.current = deps;
  }, [deps]);
  
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }

      handler()
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}
