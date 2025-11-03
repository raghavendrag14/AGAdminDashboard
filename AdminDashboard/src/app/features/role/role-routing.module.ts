import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleListPage } from './pages/role-list/role-list.page';

const routes: Routes = [{ path: '', component: RoleListPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule {}
