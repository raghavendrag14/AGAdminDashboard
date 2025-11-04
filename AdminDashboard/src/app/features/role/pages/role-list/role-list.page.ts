import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleStore } from '../../services/role.store';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-list.page.html'
})
export class RoleListPage implements OnInit {
  private store = inject(RoleStore);
  
  roles = this.store.roles$;
  loading = this.store.loading$;

  ngOnInit() {
    this.store.loadRoles();
  }

  assignPrivileges(roleId: string) {
    this.store.assignPrivileges(roleId, ['USER_CREATE', 'USER_DELETE']);
  }
}
