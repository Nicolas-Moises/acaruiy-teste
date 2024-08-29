import { Header } from "@/components/header";
import { Spinner } from "@/components/ui/spinner";
import { getProfile } from "@/services/get-profile";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedLayout() {

	const { data, isLoading } = useQuery({
		queryKey: ['get-profile'],
		queryFn: getProfile,
		placeholderData: keepPreviousData
	})

	if(isLoading) {
		return (
			<div className="h-screen flex items-center justify-center gap-2">
				<span>Carregando informações</span>
				<Spinner />
			</div>
		);
	}
	
	if (!data) {
		return <Navigate to="/login" />;
	}

  return (
    <div>
			<Header />
      <div className="container">
        <Outlet />
      </div>
    </div>
  )
}