import { Injectable, signal, computed } from '@angular/core';
import { RoleApiService } from './role-api.service';
import { Role, Privilege } from '../../../shared/models';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RoleStore {
  private roles = signal<any[]>([]);
  private privileges = signal<any[]>([]);
  private loading = signal<boolean>(false);
  private error = signal<any>(null);

  roles$ = computed(() => this.roles());
  privileges$ = computed(() => this.privileges());
  loading$ = computed(() => this.loading());
  error$ = computed(() => this.error());

  constructor(private api: RoleApiService) {}

  loadRoles() {
    //this.loading.set(true);
    return this.api.getAll().subscribe(response => {
      // 'response.data' contains the array you need
      console.log('Roles fetched:', response);
      console.log('Roles data:', response.roles);
      this.roles.set(response.roles);  
      console.log('Roles set in store:', this.roles());
     // this.paginatedData
    });
  }

  loadPrivileges() {
    this.api.getAllPrivileges().subscribe(response => {
      // 'response.data' contains the array you need
      console.log('privilege fetched:', response);
      console.log('privilege data:', response.privileges);
      this.privileges.set(response.privileges);  
      console.log('privilege set in store:', this.privileges());
     // this.paginatedData
    });
  }

  createRole(role: Partial<Role>) {
    this.api.create(role as any).subscribe(newRole => {
      this.roles.update(r => [...r, newRole]);
    });
  }

  assignPrivileges(roleId: string, privileges: string[]) {
    this.api.assignPrivileges(roleId, privileges).subscribe(updatedRole => {
      this.roles.update(r => r.map(role => role._id === updatedRole._id ? updatedRole : role));
    });
  }
}
