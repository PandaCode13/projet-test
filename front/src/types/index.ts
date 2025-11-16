export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // hashé
}

export interface AuthContextValue {
  user: User | null;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  register: ({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
}
