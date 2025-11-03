import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Role, CreateRoleDto, Privilege } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class RoleApiService {
  private readonly endpoint = 'roles';

  constructor(private api: ApiService) {}

  getAll(): Observable<Role[]> {
    return this.api.get<Role[]>(this.endpoint);
  }

  getById(id: string): Observable<Role> {
    return this.api.get<Role>(`${this.endpoint}/${id}`);
  }

  create(dto: CreateRoleDto): Observable<Role> {
    return this.api.post<Role>(this.endpoint, dto);
  }

  update(id: string, dto: Partial<Role>): Observable<Role> {
    return this.api.put<Role>(`${this.endpoint}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  assignPrivileges(roleId: string, privileges: string[]): Observable<Role> {
    return this.api.post<Role>(`${this.endpoint}/${roleId}/privileges`, { privileges });
  }

  getAllPrivileges(): Observable<Privilege[]> {
    return this.api.get<Privilege[]>('privileges');
  }
}
