import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../../services/user-api.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent {
  form: any = { username: '', email: '', password: '', roleId: '', isDelete: false };
  isEdit = false;
  isDelete = false;

  constructor(
    @Inject('modalData') public data: any,
    @Inject('modalClose') public close: (val: any) => void,
    private api: UserApiService,
  ) {
    if (data) {
      this.isEdit = !!data.isEdit;
      this.isDelete = !!data.isDelete;
      if ((this.isEdit && data.user )|| (this.isDelete && data.user )) {
        this.form = {
          username: data.user.username,
          email: data.user.email,
          password: '',
          roleId: data.user.roleId,
          _id: data.user._id,
            firstName: data.user.firstName,
            lastName: data.user.lastName
        };
      } else {
        this.form = { username: '', email: '', password: '', roleId: '', firstName: '', lastName: ''};
      }
    }
  }

  save() {
    // validation
    if (!this.form.username || !this.form.email) return;
    if (!this.isEdit && !this.form.password) return;

    this.api.saveUser(this.form).subscribe((res) => {
      this.close(res);
    });
  }
  confirmDelete() {

     this.api.deleteUser(this.form._id)
    this.close(true);
  }
  cancel() {
    this.close(null);
  }
}
