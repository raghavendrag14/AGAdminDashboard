import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleApiService } from '../../services/role-api.service';
import { Role, Privilege } from '../models/role.model';

@Component({
  selector: 'app-role-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit {
  form: any = { roleName: '', roleCode: '', _id: '',privileges: [], isDelete: false };
  isEdit = false;
  isDelete = false;
  loading = false;
  privileges: any[] = [];

  role: Role = {
    roleName: '',
    roleCode: '',
    privileges: []
  };

  // Only when loaded inside modal
  constructor(
    private api: RoleApiService,
    @Optional() @Inject('modalData') public data: any,
    @Optional() @Inject('modalClose') public close: (val: any) => void
  ) {
    if (data) {
      this.isEdit = !!data.isEdit;
      this.isDelete = !!data.isDelete;
      this.privileges = data.privileges || [];

      if ((this.isEdit && data.role) || (this.isDelete && data.role)) {
        this.role = {
          _id: data.role._id,
          roleName: data.role.roleName,
          roleCode: data.role.roleCode,
          privileges: data.role.privileges || []
        };
        this.form = { ...this.role };
      }
    }
  }

  ngOnInit() {
    if (this.data && this.isEdit && this.data.role) {
      this.role = { ...this.data.role };
    }
  }

  

  togglePrivilege(event:Event,p: any) {
    if(p.selected===undefined || p.selected===null){
        p.selected=this.role.privileges.includes(p._id);
    }
    p.selected = !p.selected;
    if (p.selected) {
        if (!this.role.privileges.includes(p._id)) {
            this.role.privileges.push(p._id);
        }
    } else {
      this.role.privileges = this.role.privileges.filter((id) => id !== p._id);
    }   
  }

  save() {
    // Validation
    if (!this.role.roleName || !this.role.roleCode) {
      console.error('Role name and code are required');
      return;
    }

    // Build payload with selected privileges
    const payload: any = {
      roleName: this.role.roleName,
      roleCode: this.role.roleCode,
      privileges: this.role.privileges
    };

    // Add ID if editing
    if (this.isEdit && this.role._id) {
      payload._id = this.role._id;
    }

    // Call appropriate API method
    const call = this.isEdit && this.role._id
      ? this.api.update(this.role._id, payload)
      : this.api.create(payload);

    call.subscribe({
      next: (res) => {
        console.log(this.isEdit ? 'Role updated successfully:' : 'Role created successfully:', res);
        // Close modal with success result
        if (this.close) {
          this.close(res);
        }
      },
      error: (err) => {
        console.error('Error saving role:', err);
        alert('Error saving role');
      }
    });
  }

  confirmDelete() {
    if (!this.role._id) {
      console.error('Cannot delete role without ID');
      return;
    }

    if (confirm('Are you sure you want to delete this role?')) {
      this.api.delete(this.role._id).subscribe({
        next: (res) => {
          console.log('Role deleted successfully:', res);
          if (this.close) {
            this.close(true);
          }
        },
        error: (err) => {
          console.error('Error deleting role:', err);
          alert('Error deleting role');
          if (this.close) {
            this.close(false);
          }
        }
      });
    }
  }
    cancel() {
    this.close(null);
  }
}
