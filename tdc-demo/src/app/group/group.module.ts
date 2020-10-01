import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveFormsModule } from '@angular/forms';

import { GroupRoutingModule } from './group-routing.module';
import { GroupListComponent } from './containers/group-list/group-list.component';
import { GroupFormComponent } from './containers/group-form/group-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [GroupListComponent, GroupFormComponent],
  imports: [CommonModule, TranslocoModule, ReactiveFormsModule, GroupRoutingModule, SharedModule]
})
export class GroupModule {}
