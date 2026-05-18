export function navigateTo(path: string, onPathChange?: (path: string) => void): void {
  window.history.pushState({}, '', path)
  onPathChange?.(path)
}

export function replaceLocation(path: string, onPathChange?: (path: string) => void): void {
  window.history.replaceState({}, '', path)
  onPathChange?.(path)
}
