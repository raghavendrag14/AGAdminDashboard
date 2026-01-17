export interface User {
  _id: string;
email:string;
firstName:string;
lastName:string;
roleId:string;
updatedAt?:string;
username:string;
}
export interface UserResponse {
  users: User[];
  total: number;
}