import { api } from "@/lib/api";

export async function deleteUser(user_id: string) {
  await api.delete(`/users/${user_id}`)
}