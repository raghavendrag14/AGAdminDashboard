import { Injectable, signal, computed } from '@angular/core';
import { RoleApiService } from './role-api.service';
import { Role, Privilege } from '../../../shared/models';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RoleStore {
  private roles = signal<Role[]>([]);
  private privileges = signal<Privilege[]>([]);
  private loading = signal<boolean>(false);
  private error = signal<any>(null);

  roles$ = computed(() => this.roles());
  privileges$ = computed(() => this.privileges());
  loading$ = computed(() => this.loading());
  error$ = computed(() => this.error());

  constructor(private api: RoleApiService) {}

  loadRoles() {
    this.loading.set(true);
    this.api.getAll().pipe(
      tap(roles => { this.roles.set(roles); this.loading.set(false); }),
      catchError(err => { this.error.set(err); this.loading.set(false); return of([]); })
    ).subscribe();
  }

  loadPrivileges() {
    this.api.getAllPrivileges().pipe(
      tap(privs => this.privileges.set(privs)),
      catchError(err => { this.error.set(err); return of([]); })
    ).subscribe();
  }

  createRole(role: Partial<Role>) {
    this.api.create(role as any).subscribe(newRole => {
      this.roles.update(r => [...r, newRole]);
    });
  }

  assignPrivileges(roleId: string, privileges: string[]) {
    this.api.assignPrivileges(roleId, privileges).subscribe(updatedRole => {
      this.roles.update(r => r.map(role => role.id === updatedRole.id ? updatedRole : role));
    });
  }
}
