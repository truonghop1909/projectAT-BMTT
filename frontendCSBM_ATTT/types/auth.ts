export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token?: string;
  accessToken?: string;
  jwt?: string;
  username?: string;
  role?: string;
  roles?: string[];
  authorities?: string[];
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
  role?: string;
};