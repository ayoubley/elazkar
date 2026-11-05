import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      {/* Mobile Top Navigation */}
      <MobileNav />

      {/* 
        Desktop Layout:
        In RTL mode, standard flex-row flows Right-to-Left.
        The first child (<main>) is anchored to the RIGHT side.
        The second child (<Sidebar>) is placed to its left, sitting visually on the LEFT side of the screen.
      */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <main className="flex-1 w-full min-w-0">{children}</main>
        <Sidebar />
      </div>
    </div>
  );
}
