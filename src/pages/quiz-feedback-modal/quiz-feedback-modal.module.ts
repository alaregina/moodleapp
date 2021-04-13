import { NgModule } from '@angular/core';
import { CoreComponentsModule } from '@components/components.module';
import { CoreCoursesComponentsModule } from '@core/courses/components/components.module';
import { CoreCoursesModule } from '@core/courses/courses.module';
import { CoreDirectivesModule } from '@directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizFeedbackModalPage } from './quiz-feedback-modal';

@NgModule({
  declarations: [
    QuizFeedbackModalPage,
  ],
  imports: [
    CoreComponentsModule,
    CoreCoursesModule,
    CoreCoursesComponentsModule,
    CoreDirectivesModule,
    IonicPageModule.forChild(QuizFeedbackModalPage),
    TranslateModule.forChild()
  ],
})
export class QuizFeedbackModalPageModule {}
