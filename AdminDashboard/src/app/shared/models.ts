export interface Privilege {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  privileges?: Privilege[];
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  privilegeIds?: string[];
}
