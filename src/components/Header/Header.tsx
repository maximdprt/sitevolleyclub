import { TopBar } from "./TopBar";
import { MainNav } from "./MainNav";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur supports-backdrop-filter:bg-white/90">
      <TopBar />
      <div className="flex items-center justify-between border-b border-slate-100 py-2 lg:border-0">
        <MainNav />
        <MobileMenu />
      </div>
    </header>
  );
}
