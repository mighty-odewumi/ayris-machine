import { useEffect, RefObject } from 'react'

export function useClickOutside(
controlsRef: RefObject<HTMLDivElement | null>, p0: () => void, p1: boolean[], ref: RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, handler])
}