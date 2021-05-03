import { NgModule } from '@angular/core';
import { CoreComponentsModule } from '@components/components.module';
import { CoreDirectivesModule } from '@directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { AllCoursesPage } from './all-courses';
import { IonAlphaScrollModule } from 'ionic2-alpha-scroll';

@NgModule({
  declarations: [
    AllCoursesPage,
  ],
  imports: [
    CoreDirectivesModule,
    CoreComponentsModule,
    IonAlphaScrollModule,
    TranslateModule.forChild(),
    IonicPageModule.forChild(AllCoursesPage),
  ],
})
export class AllCoursesPageModule {}
