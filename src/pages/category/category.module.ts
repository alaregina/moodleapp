import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryPage } from './category';
import { TranslateModule } from '@ngx-translate/core';
import { CoreComponentsModule } from '@components/components.module';
import { CoreDirectivesModule } from '@directives/directives.module';
import { CoreSiteHomeComponentsModule } from '@core/sitehome/components/components.module';
import { CoreBlockComponentsModule } from '@core/block/components/components.module';

@NgModule({
  declarations: [
    CategoryPage,
  ],
  imports: [
    CoreComponentsModule,
    CoreDirectivesModule,
    CoreSiteHomeComponentsModule,
    CoreBlockComponentsModule,
    IonicPageModule.forChild(CategoryPage),
    TranslateModule.forChild()
  ],
})
export class CategoryPageModule { }
