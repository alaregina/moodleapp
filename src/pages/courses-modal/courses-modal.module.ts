import { NgModule } from '@angular/core';
import { CoreComponentsModule } from '@components/components.module';
import { CoreCoursesComponentsModule } from '@core/courses/components/components.module';
import { CoreCoursesModule } from '@core/courses/courses.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursesModalPage } from './courses-modal';

@NgModule({
  declarations: [
    CoursesModalPage,
  ],
  imports: [
    CoreComponentsModule,
    CoreCoursesModule,
    CoreCoursesComponentsModule,
    IonicPageModule.forChild(CoursesModalPage),
    TranslateModule.forChild()
  ],
})
export class CoursesModalPageModule {}
