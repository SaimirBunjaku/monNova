"use client";

import { useEffect, useLayoutEffect } from "react";
import {
  applyScrollbarCompensation,
  clearScrollbarCompensation,
} from "@/lib/scroll-lock";

const SPLASH_DURATION_MS = 2400;
const EXIT_DURATION_MS = 650;

function finishSplash() {
  const splash = document.getElementById("nova-splash");
  splash?.classList.add("nova-splash-done");
  document.documentElement.classList.remove("nova-splash-pending");
  document.documentElement.classList.remove("nova-splash-exiting");
  clearScrollbarCompensation();
}

export function AppSplashDismiss() {
  useLayoutEffect(() => {
    if (document.documentElement.classList.contains("nova-splash-pending")) {
      applyScrollbarCompensation();
    }
  }, []);

  useEffect(() => {
    const splash = document.getElementById("nova-splash");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!splash || prefersReducedMotion) {
      finishSplash();
      return;
    }

    const exitTimer = window.setTimeout(() => {
      document.documentElement.classList.add("nova-splash-exiting");
      splash.classList.add("nova-splash-exit");
    }, SPLASH_DURATION_MS);

    const hideTimer = window.setTimeout(() => {
      finishSplash();
    }, SPLASH_DURATION_MS + EXIT_DURATION_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return null;
}
