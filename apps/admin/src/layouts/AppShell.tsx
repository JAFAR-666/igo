import type { PropsWithChildren } from "react";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <span className="sidebar__brand">igo</span>
          <p>Labor marketplace control room</p>
        </div>
        <nav>
          <a href="#overview">Overview</a>
          <a href="#workers">Workers</a>
          <a href="#wages">Wage Ranges</a>
          <a href="#complaints">Complaints</a>
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
