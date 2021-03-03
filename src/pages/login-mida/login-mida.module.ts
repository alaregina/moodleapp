import { NgModule } from '@angular/core';
import { CoreComponentsModule } from '@components/components.module';
import { CoreDirectivesModule } from '@directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginMidaPage } from './login-mida';

@NgModule({
  declarations: [
    LoginMidaPage,
  ],
  imports: [
    CoreComponentsModule,
    CoreDirectivesModule,
    IonicPageModule.forChild(LoginMidaPage),
    TranslateModule.forChild()
  ],
})
export class LoginMidaPageModule {}
