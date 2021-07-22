import { Injectable } from '@angular/core';
import { CoreSitesProvider, CoreSiteUserTokenResponse } from '@providers/sites';

@Injectable()
export class NavigationProvider {
  canGoBack: boolean = true;

  constructor() {
  }

  getCanGoBack() {
    return this.canGoBack;
  }

}
