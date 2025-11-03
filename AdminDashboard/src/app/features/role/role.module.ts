import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleListPage } from './pages/role-list/role-list.page';
import { RoleRoutingModule } from './role-routing.module';

@NgModule({
  declarations: [RoleListPage],
  imports: [CommonModule, RoleRoutingModule]
})
export class RoleModule {}
