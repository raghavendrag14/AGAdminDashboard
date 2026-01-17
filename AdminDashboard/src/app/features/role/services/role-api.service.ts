import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Role, CreateRoleDto, Privilege,RoleResponse } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class RoleApiService {
  private readonly endpoint = 'roles';

  constructor(private api: ApiService) {}

  getAll(): Observable<RoleResponse> {
    return this.api.get<RoleResponse>(this.endpoint);
  }

  getById(id: string): Observable<Role> {
    return this.api.get<Role>(`${this.endpoint}/${id}`);
  }

  create(dto: CreateRoleDto): Observable<Role> {
    return this.api.post<Role>(`${this.endpoint}/createRole`, dto);
  }
  update(id: string, dto: Partial<Role>): Observable<Role> {
    return this.api.post<Role>(`${this.endpoint}/UpdateRole`, dto);
  }

  delete(id: string): Observable<void> {
    let data={_id:id};
    return this.api.post<void>(`${this.endpoint}/deleteRole`,data);
  }

  assignPrivileges(roleId: string, privileges: string[]): Observable<Role> {
    return this.api.post<Role>(`${this.endpoint}/${roleId}/privileges`, { privileges });
  }

  getAllPrivileges(): Observable<any> {
    return this.api.get<any>('roles/privileges');
  }
}
