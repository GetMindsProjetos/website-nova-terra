// Trava de rolagem compartilhada entre SmoothScroll (Lenis) e componentes modais.
// Contador de referências: várias camadas podem travar; só destrava quando todas liberam.
import type Lenis from "lenis";

let lenis: Lenis | null = null;
let locks = 0;

function apply(locked: boolean) {
  const html = document.documentElement;
  html.style.overflow = locked ? "hidden" : "";
  document.body.style.overflow = locked ? "hidden" : "";
  if (locked) lenis?.stop();
  else lenis?.start();
}

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  if (instance && locks > 0) instance.stop();
}

export function lockScroll() {
  locks += 1;
  if (locks === 1) apply(true);
}

export function unlockScroll() {
  if (locks === 0) return;
  locks -= 1;
  if (locks === 0) apply(false);
}
