export interface Privilege {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface Role {
  _id: string;
  roleName: string;
  roleCode:string;
  description?: string;
  privileges?: Privilege[];
  createdAt:string;
  updatedAt:string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  privilegeIds?: string[];
}

export interface RoleResponse {
  roles: Role[];
  total: number;
} 
