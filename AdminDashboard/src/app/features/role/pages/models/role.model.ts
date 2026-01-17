export interface Privilege {
  _id: string;
  name: string;
  code: string;
  selected?: boolean;
}

export interface Role {
  _id?: string;
  roleName: string;
  roleCode?: string;
  privileges: string[]; // privilege IDs
}