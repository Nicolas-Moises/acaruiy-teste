import { User } from "@/_types/user";
import { api } from "@/lib/api";

export async function getUserDetails(userId: string): Promise<User> {
  const res = await api.get(`/users/${userId}`)
  return res.data.data
}