import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PoButtonModule, PoFieldModule, PoModule, PoPageModule} from '@po-ui/ng-components';


@NgModule({
  declarations: [],
  imports: [CommonModule, PoModule],
  exports: [PoModule]
})
export class SharedModule {
}
