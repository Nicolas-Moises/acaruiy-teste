import { api } from "@/lib/api";

type CreateUserRequest = {
  email?: string
  phone?: string
  cellphone?: string
  avatar?: FileList
  userId: string
}

export async function updateUser(data: CreateUserRequest): Promise<void> {
  const { userId, avatar, cellphone, email, phone } = data
  await api.post(`/users/${userId}`, {
    email,
    phone,
    cellphone,
    avatar: avatar?.[0] ?? undefined,
  }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}