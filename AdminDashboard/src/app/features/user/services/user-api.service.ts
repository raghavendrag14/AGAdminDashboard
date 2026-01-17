import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { User, UserResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  

   private api = inject(ApiService);
  getUsers(): Observable<UserResponse> {
    // Call backend API to fetch all users and normalize fields to UI model
    return this.api.get<UserResponse>('users/getAllUsers');
  }

  getUserById(id: string): Observable<any> {
    return this.api.get<any>(`users/getUserById/${id}`);
  }

  saveUser(user: User): Observable<User> {
    if (user._id) {
      this.api.post<User>(`users/updateUser`, user).subscribe(r=>{
        if (r) {
          console.log('User updated successfully:', r);
        } else {
          console.error('Failed to update user:', r);
        }
      });
      // const index = this.users.findIndex(u => u.id === user.id);
      // this.users[index] = { ...user };
    } else {
      this.api.post<User>('users/createUser', user).subscribe(r=>{
        if (r) {
          console.log('User created successfully:', r);
        } else {
          console.error('Failed to create user:', r);
        }
    });
    return of(user);
  }
}

  deleteUser(id: string): Observable<boolean> {
    const data = { id: id };
    this.api.post(`users/deleteUser/`,data).subscribe(r=>{
      console.log('User deleted successfully:', r);
    });
    return of(true);
  }
}
