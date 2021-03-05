import { NgModule } from '@angular/core';
import { CoreComponentsModule } from '@components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursesModalPage } from './courses-modal';

@NgModule({
  declarations: [
    CoursesModalPage,
  ],
  imports: [
    CoreComponentsModule,
    IonicPageModule.forChild(CoursesModalPage),
    TranslateModule.forChild()
  ],
})
export class CoursesModalPageModule {}
