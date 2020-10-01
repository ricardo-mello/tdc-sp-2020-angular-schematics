import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupListComponent } from './containers/group-list/group-list.component';
import { GroupFormComponent } from './containers/group-form/group-form.component';

const routes: Routes = [
  { path: '', component: GroupListComponent },
  { path: 'create', component: GroupFormComponent },
  { path: 'edit/:id', component: GroupFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule {}
