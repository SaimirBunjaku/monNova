import { SplashStars } from "@/components/splash-stars";

export function AppSplashShell() {
  return (
    <div id="nova-splash" className="nova-splash" aria-hidden="true">
      <SplashStars />
      <div className="nova-splash-glow" aria-hidden="true" />
      <div className="nova-splash-content">
        <div className="nova-splash-logo-wrap">
          <span className="nova-splash-logo font-heading">
            NOV<span className="nova-splash-logo-accent">A</span>
          </span>
          <span className="nova-splash-tagline">Store</span>
        </div>
        <div className="nova-splash-line" aria-hidden="true" />
      </div>
    </div>
  );
}
