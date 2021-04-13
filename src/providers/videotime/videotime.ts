import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreSiteWSPreSets } from '@classes/site';
import { TranslateService } from '@ngx-translate/core';
import { CoreSitesProvider } from '@providers/sites';

/*
  Generated class for the VideotimeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VideotimeProvider {

  constructor(public http: HttpClient, 
    private siteProvider: CoreSitesProvider,
    protected translate: TranslateService) {
    //get_resume_time
  }

  getResumeTime(moduleid: string, siteId?:string)
  : Promise<any> {
    return this.siteProvider.getSite(siteId).then(site=>{
        var userId = site.getUserId();
        const params = {
          userid: userId,
          cmid:moduleid
      }

      return site.read('videotimeplugin_pro_get_resume_time', params).then((result) => {
          return result;
      });
    })
  }
}
