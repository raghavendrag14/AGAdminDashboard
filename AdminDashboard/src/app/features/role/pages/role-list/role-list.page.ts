import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleStore } from '../../services/role.store';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { RoleDetailsComponent } from '../role-details/role-details.component';
import { Role } from '../models/role.model';
import { ModalService } from '../../../../shared/components/modal/model.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent,ModalComponent],
  templateUrl: './role-list.page.html'
})
export class RoleListPage implements OnInit {
  private store = inject(RoleStore);
  
  roles = this.store.roles$;
  privileges = this.store.privileges$;
  loading = this.store.loading$;

  constructor(private modal: ModalService) {}
  ngOnInit() {
    this.store.loadRoles();
    this.store.loadPrivileges();
  }

  assignPrivileges(roleId: string) {
    this.store.assignPrivileges(roleId, ['USER_CREATE', 'USER_DELETE']);
  }
  onAdd() {
    console.log('[UserManagement] onAdd clicked');
    // open user details modal for create
    const data = { role: null,  isEdit: false,isDelete:false,privileges:this.privileges() };
   console.log('Opening modal with data:', data);
    this.modal.open({ title: 'Add Role', component: RoleDetailsComponent, componentData: data }, 'lg');
    const sub = this.modal.modalResult$.subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res) this.store.loadRoles();
        sub.unsubscribe();
      }
    });
  }

  onEdit(role: Role) {
    
    const data = { role,  isEdit: true ,isDelete:false,privileges:this.privileges()};
    this.modal.open({ title: 'Edit Role', component: RoleDetailsComponent, componentData: data }, 'lg');
    const sub = this.modal.modalResult$.subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res) this.store.loadRoles();
        sub.unsubscribe();
      }
    });
  }
  

  onDelete(role: Role) {

      const data = { role,  isEdit: false,isDelete:true ,privileges:this.privileges()};
    this.modal.open({ title: 'Delete User', component: RoleDetailsComponent, componentData: data }, 'md');
    const sub = this.modal.modalResult$.subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res) this.store.loadRoles();
        sub.unsubscribe();
      }
    });
    
  }
}
