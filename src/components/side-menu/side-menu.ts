import { Component, Input } from '@angular/core';
import { CoreEventsProvider } from '@providers/events';
import { CoreSitesProvider } from '@providers/sites';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the SideMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html'
})
export class SideMenuComponent {
  @Input('navCtrl') navCtrl: NavController;
  @Input('content') content: any;
  text: string;
  siteInfo: any;
  siteName: string;
  siteUrl: string;
  langObserver: any;
  updateSiteObserver: any;
  avatarUrl?: string;

  constructor(private sitesProvider: CoreSitesProvider, eventsProvider: CoreEventsProvider) {
    this.langObserver = eventsProvider.on(CoreEventsProvider.LANGUAGE_CHANGED, this.loadSiteInfo.bind(this));
    this.updateSiteObserver = eventsProvider.on(CoreEventsProvider.SITE_UPDATED, this.loadSiteInfo.bind(this));
    this.updateSiteObserver = eventsProvider.on(CoreEventsProvider.LOGIN, this.loadSiteInfo.bind(this));
    this.loadSiteInfo()
  }

    /**
     * Load the site info required by the view.
     */
    protected loadSiteInfo(): void {
      const currentSite = this.sitesProvider.getCurrentSite();
      if (!!currentSite) {
        this.siteInfo = currentSite.getInfo();
        this.siteName = currentSite.getSiteName();
        this.siteUrl = currentSite.getURL();
      }
  }

  /**
     * Function executed image clicked.
     */
    gotoProfile(event: any): void {
      if (this.siteInfo.userid) {
          event.preventDefault();
          event.stopPropagation();
          this.navCtrl.push('UserProfilePage', { userId: this.siteInfo.userid, courseId: this.siteInfo.courseId });
      }
  }
}
