import Link from "next/link";
import { groups, titles } from "@/lib/site";
import { ThemeControls } from "@/components/theme-controls";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-7xl flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6 lg:py-6">
      <aside className="flex shrink-0 flex-col gap-6 lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:w-72 lg:overflow-y-auto">
        <Link
          href="/"
          className="focus-ring flex items-center gap-3 rounded-shape-medium"
        >
          <span className="grid size-10 place-items-center rounded-shape-medium bg-primary text-title-medium text-on-primary corner-squircle">
            Ex
          </span>
          <span className="text-title-large font-brand">Expressive</span>
        </Link>
        <nav aria-label="Components" className="flex flex-col gap-4">
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-0.5">
              <span className="px-4 pb-1 text-label-medium text-on-surface-variant">{group.title}</span>
              {group.items.map((name) => (
                <Link
                  key={name}
                  href={`/docs/${name}`}
                  className="state-layer focus-ring rounded-shape-full px-4 py-2 text-label-large text-on-surface-variant"
                >
                  {titles[name] ?? name}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <section
          aria-label="Theme"
          className="rounded-shape-extra-large bg-surface-container p-5"
        >
          <h2 className="mb-4 text-title-medium">Theme</h2>
          <ThemeControls />
        </section>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
