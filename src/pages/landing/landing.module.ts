import { NgModule } from '@angular/core';
import { CoreComponentsModule } from '@components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { LandingPage } from './landing';

@NgModule({
  declarations: [
    LandingPage,
  ],
  imports: [
    CoreComponentsModule,
    TranslateModule.forRoot(),
    IonicPageModule.forChild(LandingPage),
  ],
  entryComponents: [
    LandingPage
  ]
})
export class LandingPageModule {}
