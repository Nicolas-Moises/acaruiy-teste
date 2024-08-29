import { Navigate, Outlet } from "react-router-dom";

import AcaruiyLogo from '@/assets/acaruiy-logo.png'
import { useAuth } from "@/hooks/useAuth";

export function AuthLayout() {

  const { user } = useAuth()

  if (user) {
		return <Navigate to="/" />
	}

  return (
    <div className="min-h-screen flex items-center justify-center px-2 md:px-0">
      <div className="bg-card flex w-full max-w-md flex-col gap-6 p-8 rounded-2xl border border-border shadow-lg">
        <img src={AcaruiyLogo} alt="Acaruiy logotipo" className="size-12 rounded-lg" />
        <Outlet />
      </div>
    </div>
  )
}