// src/lib/navigation.ts
type NavigateFn = (path: string) => void;

let navigate: NavigateFn | null = null;

export function setNavigator(fn: NavigateFn) {
  navigate = fn;
}

export function go(path: string) {
  if (navigate) navigate(path);
}

export function goLogin() {
  go("/login");
}
