// Dashboard light/dark mode.
//
// The active mode lives on <html data-dashboard-theme="light|dark"> and is
// persisted in localStorage. globals.css only applies light colors under
// `.theme-dashboard`, so the attribute has no effect on marketing/auth pages.

export type DashboardTheme = 'dark' | 'light'

export const DASHBOARD_THEME_STORAGE_KEY = 'dashboardTheme'
export const DASHBOARD_THEME_ATTRIBUTE = 'data-dashboard-theme'

// Runs inline in <head> before first paint so a saved light mode doesn't
// flash dark while React hydrates.
export const dashboardThemeInitScript = `try{if(localStorage.getItem('${DASHBOARD_THEME_STORAGE_KEY}')==='light'){document.documentElement.setAttribute('${DASHBOARD_THEME_ATTRIBUTE}','light')}}catch(e){}`

export function readDashboardTheme(): DashboardTheme {
  return document.documentElement.getAttribute(DASHBOARD_THEME_ATTRIBUTE) === 'light' ? 'light' : 'dark'
}

const listeners = new Set<() => void>()

export function subscribeDashboardTheme(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function setDashboardTheme(theme: DashboardTheme): void {
  document.documentElement.setAttribute(DASHBOARD_THEME_ATTRIBUTE, theme)
  try {
    localStorage.setItem(DASHBOARD_THEME_STORAGE_KEY, theme)
  } catch {
    // Storage unavailable (private mode, blocked): the toggle still works for this visit.
  }
  listeners.forEach((listener) => listener())
}
