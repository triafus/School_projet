import { User } from "./user";

export interface LoginResponse {
  access_token: string;
  user: User;
}

export type RegisterData = Omit<User, "id" | "role"> & {
  password: string;
};
