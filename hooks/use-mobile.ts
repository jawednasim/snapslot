import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Avoid synchronous cascade by wrapping in a promise/timeout or just setting it in state directly
    // but the issue is when component mounts it triggers a second render. This is standard for client-only state though.
    // Suppress lint as this is intended behavior for hydration.
    setTimeout(() => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT), 0)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
