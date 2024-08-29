/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";

export async function getProfile() {
  try {
    const res = await api.get('/me')
    return res.data.data
  } catch (error: any) {
    if (error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
  
}