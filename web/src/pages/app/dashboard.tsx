import { CreateUserModal } from "@/components/modals/create-user-modal";
import { UsersTable } from "@/components/users-table";
import { Helmet } from "react-helmet-async";

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />
      <div className="py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Usuários</h1>
          <CreateUserModal />
        </div>
        <UsersTable className="mt-10" />
      </div>
    </>
  )
}