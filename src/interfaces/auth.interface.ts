export interface UserPayload {
  id: string;
  isAdmin: boolean;
}

export interface TokenPayload {
  id: string;
  isAdmin: boolean;
  fullName: string;
  avatarURL: string;
  backgroundURL: string;
}
