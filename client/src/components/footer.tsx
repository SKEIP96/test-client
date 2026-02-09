"use client";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-semibold tracking-tight">
              Workshop Supply
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Workshop-grade essentials for clean builds.
              Tools, materials and parts — nothing extra.
            </p>
          </div>

          {/* Column 1 */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Chisinau</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition">Biznesdengi@gmail.huy</li>
              <li className="hover:text-foreground transition">Vasili Zalupu 5/11</li>
              <li className="hover:text-foreground transition inline-flex items-center  underline underline-offset-4">
                SEE ON MAP
                <span className="inline-block">↗</span>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Account</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition">Orders</li>
              <li className="hover:text-foreground transition">Cart</li>
              <li className="hover:text-foreground transition">Profile</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Company</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition">About</li>
              <li className="hover:text-foreground transition">Contact</li>
              <li className="hover:text-foreground transition">Legal</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Workshop Supply</div>

          <div className="flex gap-6">
            <span className="hover:text-foreground transition">
              Newsletter →
            </span>
            <span className="hover:text-foreground transition">
              Instagram
            </span>
            <span className="hover:text-foreground transition">
              LinkedIn
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
