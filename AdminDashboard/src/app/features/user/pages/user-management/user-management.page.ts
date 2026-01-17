import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { UserApiService } from '../../services/user-api.service';
import { RoleApiService } from '../../../role/services/role-api.service';
import { ModalService } from '../../../../shared/components/modal/model.service';
import { UserDetailsComponent } from '../../components/user-details/user-details.component';
import { UserProfileComponent } from '../../components/user-profile/user-profile.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { SearchFilterComponent } from '../../../../shared/components/search-filter/search-filter.component';
import { signal, computed, effect } from '@angular/core';
import { createTableController } from '../../../../shared/utils/table-controller';
import { SearchField, FilterField } from '../../../../shared/components/search-filter/search-filter.component';
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import { viewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, PaginationComponent, SearchFilterComponent, ModalComponent],
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
})
export class UserManagementPage implements OnInit {
    
  users = signal<any[]>([]);
  roles = signal<any[]>([]);
  showForm = false;
  isEdit = false;
  // Using a loose type for formData to allow password on create
  formData: any = { _id: '', username: '', email: '', password: '', roleId: '' , firstName: '', lastName: ''};

filterValues: any = {};
  constructor(private api: UserApiService, private roleApi: RoleApiService, private modal: ModalService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  private loadRoles() {
    this.roleApi.getAll().subscribe(r => {
        this.roles.set(r.roles || [])
        if (r.roles) {
         for (let role of r.roles) {
            console.log('Loaded role:', role.roleName);
            this.filterConfig[0].options.push({ label: role.roleName, value: role.roleName });
         }
        }
    });
  }

  loadUsers() {
    this.api.getUsers().subscribe(response => {
      // 'response.data' contains the array you need
      this.users.set(response.users);
     // this.paginatedData
    });
  }

  onAdd() {
    console.log('[UserManagement] onAdd clicked');
    // open user details modal for create
    const data = { user: null, roles: this.roles(), isEdit: false,isDelete:false };
    this.modal.open({ title: 'Add User', component: UserDetailsComponent, componentData: data }, 'md');
    const sub = this.modal.modalResult$.subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res) this.loadUsers();
        sub.unsubscribe();
      }
    });
  }

  onEdit(user: User) {
    console.log('[UserManagement] onEdit clicked', user && user._id);
    const data = { user, roles: this.roles(), isEdit: true ,isDelete:false};
    this.modal.open({ title: 'Edit User', component: UserDetailsComponent, componentData: data }, 'md');
    const sub = this.modal.modalResult$.subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res) this.loadUsers();
        sub.unsubscribe();
      }
    });
  }
  

  onDelete(user: string) {

      const data = { user, roles: null, isEdit: false,isDelete:true };
    this.modal.open({ title: 'Delete User', component: UserDetailsComponent, componentData: data }, 'md');
    const sub = this.modal.modalResult$.subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res) this.loadUsers();
        sub.unsubscribe();
      }
    });
    
  }

  onProfile(user: User) {
    console.log('[UserManagement] onProfile clicked', user && user._id);
    const data = { userId: user._id };
    this.modal.open({ title: 'User Profile', component: UserProfileComponent, componentData: data }, 'md');
    // Profile view is read-only, no need to subscribe to result
  }

  onCancel() {
    this.showForm = false;
  }

searchConfig: SearchField[] = [
    { key: 'firtName', placeholder: 'Search by Name' },
     { key: 'email', placeholder: 'Search by email' },
     { key: 'username', placeholder: 'Search by username' },
    { key: 'roleName', placeholder: 'Search by Role' }
     
  ];

  filterConfig: FilterField[] = [
    {
      key: 'roleName',
      label: 'Role',
      options: []
    }
  ];
  sortConfig = [
  { key: 'username', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'roleName', label: 'Role Name', sortable: true }
  
];

  // create a generic table controller (search/filter/sort/pagination)
  table = createTableController(() => this.users(), { pageSize: 10, searchFields: this.searchConfig, filterFields: this.filterConfig, sortConfig: this.sortConfig });

  // expose signals/computeds used by the template
  page = this.table.page;
  // avoid a getter that repeatedly executes during change-detection/debugging
  // instead expose a plain number updated by an effect
  pageSizeValue: number = Number(this.table.pageSize());
  // keep pageSizeValue in sync with the table controller
  private _pageSizeSync = effect(() => {
    this.pageSizeValue = Number(this.table.pageSize());
  });
 
  pageTotelItems = this.table.totalItems;
  pageTotal = this.table.totalPages;
  paginatedData = this.table.paginatedData;

  // keep query state accessible if needed
  queryState = this.table.queryState;

  onQueryChanged(q: any) {
    // q expected shape { search: {...}, filter: {...} }
    this.table.setQuery(q);
  }

  onPageChanged(p: number) {
    this.table.setPage(p);
  }

  onSort(column: string) {
    const currentKey = this.table.sortKey();
    const currentDir = this.table.sortDir();
    let direction: 'asc' | 'desc' = 'asc';
    if (currentKey === column) direction = currentDir === 'asc' ? 'desc' : 'asc';
    this.table.setSort(column, direction);
  }
}
