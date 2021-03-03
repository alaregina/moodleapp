import { NgModule } from '@angular/core';
import { CoreComponentsModule } from '@components/components.module';
import { IonicPageModule } from 'ionic-angular';
import { LandingPage } from './landing';

@NgModule({
  declarations: [
    LandingPage,
  ],
  imports: [
    CoreComponentsModule,
    IonicPageModule.forChild(LandingPage),
  ],
  entryComponents: [
    LandingPage
  ]
})
export class LandingPageModule {}
