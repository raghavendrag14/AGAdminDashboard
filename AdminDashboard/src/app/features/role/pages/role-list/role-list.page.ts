import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RoleStore } from '../../services/role.store';

@Component({
  selector: 'app-role-list',
  imports: [],
  templateUrl: './role-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListPage implements OnInit {
  private store = inject(RoleStore);
  roles = this.store.roles$;
  loading = this.store.loading$;

  ngOnInit() { this.store.loadRoles(); }

  assignPrivileges(roleId: string) {
    this.store.assignPrivileges(roleId, ['USER_CREATE', 'USER_DELETE']);
  }
}
