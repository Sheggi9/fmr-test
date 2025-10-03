export interface NewUser {
  name: string;
}
export interface User extends NewUser {
  id: number;
}
