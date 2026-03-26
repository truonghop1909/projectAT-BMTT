export type User = {
  id: number;
  username: string;
  role?: string;
  active?: boolean;
};

export type UserCreateRequest = {
  username: string;
  password: string;
  role: string;
};

export type UserUpdateRequest = {
  username?: string;
  role?: string;
  active?: boolean;
};