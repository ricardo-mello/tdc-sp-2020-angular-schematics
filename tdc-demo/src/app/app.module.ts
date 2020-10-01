import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco/transloco-root.module';
import { PoModule } from '@po-ui/ng-components';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslocoRootModule,
    PoModule,
    RouterModule.forRoot([
      {path: 'groups', loadChildren: () => import('./group/group.module').then(m => m.GroupModule),}
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
