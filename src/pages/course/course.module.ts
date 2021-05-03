import { NgModule } from '@angular/core';
import { CoreComponentsModule } from '@components/components.module';
import { CoreDirectivesModule } from '@directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursePage } from './course';

@NgModule({
  declarations: [
    CoursePage,
  ],
  imports: [
    CoreDirectivesModule,
    CoreComponentsModule,
    TranslateModule.forChild(),
    IonicPageModule.forChild(CoursePage),
  ],
})
export class CoursePageModule {}
