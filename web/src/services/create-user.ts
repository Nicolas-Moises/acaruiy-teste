import { api } from "@/lib/api";

type CreateUserRequest = {
  name: string
  email: string
  phone: string
  document: string
  cellphone: string
  avatar: FileList | undefined
}

export async function createUser(data: CreateUserRequest): Promise<void> {
  const { email, phone, document, cellphone, avatar } = data
  await api.post('/users', {
    name,
    email,
    phone,
    document,
    cellphone,
    avatar: avatar?.[0] ?? undefined,
  }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}