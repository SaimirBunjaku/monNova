const SCROLLBAR_WIDTH_VAR = "--nova-scrollbar-width";

export function getScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth;
}

export function applyScrollbarCompensation(): number {
  const scrollbarWidth = getScrollbarWidth();

  if (scrollbarWidth <= 0) {
    return 0;
  }

  const padding = `${scrollbarWidth}px`;
  document.documentElement.style.setProperty(SCROLLBAR_WIDTH_VAR, padding);
  document.body.style.paddingRight = padding;

  document.querySelectorAll<HTMLElement>("[data-scrollbar-compensate]").forEach(
    (element) => {
      element.style.paddingRight = padding;
    },
  );

  return scrollbarWidth;
}

export function clearScrollbarCompensation(): void {
  document.documentElement.style.removeProperty(SCROLLBAR_WIDTH_VAR);
  document.body.style.paddingRight = "";

  document.querySelectorAll<HTMLElement>("[data-scrollbar-compensate]").forEach(
    (element) => {
      element.style.paddingRight = "";
    },
  );
}
