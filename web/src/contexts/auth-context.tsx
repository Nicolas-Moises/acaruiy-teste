import { User } from "@/_types/user";
import { api } from "@/lib/api";
import axios from 'axios';
import { createContext, ReactNode, useState } from "react";

interface AuthContextType {
  user: User | null;
  setUserFn: (user: User) => void;
  csrfToken: () => Promise<boolean>;
  handleLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUserFn: () => {},
  csrfToken: async () => false,
  handleLogout: async () => {}
});

export function AuthProvider({ children }: { children: ReactNode}) {
  const [user, setUser] = useState<User>(
    JSON.parse(localStorage.getItem('user') ?? 'null')
  )

  const setUserFn = (user: User) => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		} else {
			localStorage.removeItem('user');
		}
		setUser(user);
	}

  const csrfToken = async (): Promise<boolean> => {
    await axios.get('http://localhost/sanctum/csrf-cookie');
    return true;
  };

  const handleLogout = async () => {
		try {
			const resp = await api.post('/logout');
			if (resp.status === 200) {
				localStorage.removeItem('user');
				window.location.href = '/login';
			}
		} catch (error) {
			console.log(error);
		}
	};

  return (
    <AuthContext.Provider value={{ user, setUserFn, csrfToken, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}