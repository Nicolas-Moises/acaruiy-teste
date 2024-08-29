import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button, buttonVariants } from "../ui/button";
import EyeIcon from "../icons/eye-icon";
import { Link, useSearchParams } from "react-router-dom";
import { DeleteUserModal } from "../modals/delete-user-modal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/get-users";
import { Skeleton } from "../ui/skeleton";
import UserGroupIcon from "../icons/user-group-icon";
import DeleteIcon from "../icons/delete-icon";
import { Pagination } from "../pagination";
import { z } from "zod";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function UsersTable({ className, ...props }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()

  const pageIndex = z.coerce
    .number()
    .parse(searchParams.get('page') ?? '1')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['get-users', pageIndex],
    queryFn: async () => await getUsers({ current_page: pageIndex }),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })

  const users = data?.data

  if(isLoading) {
    return (
      <UsersTableSkeleton />
    )
  }
  if(isError) {
    return (
      <div>Error fetching</div>
    )
  }

  if(!users) {
    return (
      <div>Error fetching</div>
    )
  }

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', (pageIndex).toString())

      return state
    })
  }


  return (
    <div className={cn('', className)} {...props}>

      {users && users?.length > 0 ? (
        <>
          <Table>
            <TableHeader className="border-b-0">
              <TableRow className="bg-[#E1E4EA] border-transparent">
                <TableHead className="w-[100px] rounded-l-lg">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Celular</TableHead>
                <TableHead>Endereço principal</TableHead>
                <TableHead className="text-right rounded-r-lg">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="whitespace-nowrap">{user.cellphone}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.main_address ?? 'Nenhum endereço cadastrado'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link 
                        to={`/users/${user.id}`} 
                        className={buttonVariants({ variant: 'outline', size: 'icon', className: 'w-8 h-8' })}
                      >
                        <span className="sr-only">Ver detalhes</span>
                        <EyeIcon className="size-5" />
                      </Link>
                      <DeleteUserModal user_id={user.id}>
                        <Button variant="destructive" size='icon' className="size-8">
                          <span className="sr-only">Excluir usuário</span>
                          <DeleteIcon className="size-5" />
                        </Button>
                      </DeleteUserModal>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination 
            onPageChange={handlePaginate}
            pageIndex={data?.meta.current_page}
            totalCount={data?.meta.total}
            perPage={data?.meta.per_page} 
          />
        </>
      ) : (
        // empty
        <div className="py-10 flex items-center flex-col justify-center gap-2">
          <UserGroupIcon className="size-10 text-muted-foreground" />
          <h4 className="text-lg font-medium tracking-tight">Nenhum usuário cadastrado</h4>
        </div>
      )}
    </div>
  );
}

function UsersTableSkeleton() {
  return (
    <Table className="">
      <TableBody>
        {
          Array.from({ length: 10 }).map((_, i) => {
            return (
              <TableRow key={i}>
                <TableCell className="">
                  <Skeleton className="h-4 w-full " />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full max-w-[300px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full max-w-[190px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-full max-w-[64px]" />
                </TableCell>
              </TableRow>
            )
          })
        }
      </TableBody>
    </Table>
  )
}