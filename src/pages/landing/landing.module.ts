import { NgModule } from '@angular/core';
import { CoreComponentsModule } from '@components/components.module';
import { CoreDirectivesModule } from '@directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { LandingPage } from './landing';

@NgModule({
  declarations: [
    LandingPage,
  ],
  imports: [
    CoreComponentsModule,
    CoreDirectivesModule,
    IonicPageModule.forChild(LandingPage),
    TranslateModule.forChild()
  ],
  entryComponents: [
    LandingPage
  ]
})
export class LandingPageModule { }
