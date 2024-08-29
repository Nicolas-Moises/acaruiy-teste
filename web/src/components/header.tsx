import AcaruiyLogo from '@/assets/acaruiy-logo.png'
import { Nav, UserNav } from "./nav";

export function Header() {
  return (
    <header className="w-full border-b border-border">
      <div className="container py-3 flex items-center gap-10">
        <img src={AcaruiyLogo} alt="Acaruiy logotipo" className="size-8 rounded-lg" />
        <Nav />
        <UserNav />
      </div>
    </header>
  )
}