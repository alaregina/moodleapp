import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeacherDetailPage } from './teacher-detail';

@NgModule({
  declarations: [
    TeacherDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TeacherDetailPage),
  ],
})
export class TeacherDetailPageModule {}
