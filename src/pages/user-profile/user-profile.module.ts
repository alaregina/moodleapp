import { NgModule } from '@angular/core';
import { CoreComponentsModule } from '@components/components.module';
import { CoreDirectivesModule } from '@directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfilePage } from './user-profile';

@NgModule({
  declarations: [
    UserProfilePage,
  ],
  imports: [
    CoreDirectivesModule,
    CoreComponentsModule,
    IonicPageModule.forChild(UserProfilePage),
    TranslateModule.forChild(),
  ],
})
export class UserProfilePageModule {}
