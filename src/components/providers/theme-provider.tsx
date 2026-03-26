"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// The latest next-themes no longer strictly exports type ThemeProviderProps as it used to do it directly in TS
// We'll declare standard types
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
