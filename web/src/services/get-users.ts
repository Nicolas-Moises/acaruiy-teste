import { User } from "@/_types/user";
import { api } from "@/lib/api";

type GetUsersResponse = {
  data: User[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

type GetUsersRequest = {
  current_page?: number | null
}

export async function getUsers({ current_page }: GetUsersRequest): Promise<GetUsersResponse> {
  const res = await api.get('/users', {
    params: {
      page: current_page,
    },
  })
  return res.data
}