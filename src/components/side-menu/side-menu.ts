import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CoreUserProvider } from '@core/user/providers/user';
import { CoreEventsProvider } from '@providers/events';
import { CoreSitesProvider } from '@providers/sites';
import { MenuController, NavController } from 'ionic-angular';

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
  user: any;

  constructor(private sitesProvider: CoreSitesProvider, eventsProvider: CoreEventsProvider,
    private menuCtrl: MenuController,
    private userProvider: CoreUserProvider) {

    this.langObserver = eventsProvider.on(CoreEventsProvider.LANGUAGE_CHANGED, this.loadSiteInfo.bind(this));
    this.updateSiteObserver = eventsProvider.on(CoreEventsProvider.SITE_UPDATED, this.loadSiteInfo.bind(this));
    this.updateSiteObserver = eventsProvider.on(CoreEventsProvider.LOGIN, this.loadSiteInfo.bind(this));
    this.loadSiteInfo();

  }

  loadAvatar() {
    this.userProvider.getProfile(this.siteInfo.userid, null).then((user) => {
      this.user = user;

      const profileUrl = (this.user && (this.user.profileimageurl || this.user.userprofileimageurl ||
        this.user.userpictureurl || this.user.profileimageurlsmall || (this.user.urls && this.user.urls.profileimage)));

      if (typeof profileUrl == 'string') {
        this.avatarUrl = profileUrl;
      }
    })
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
      if (!!this.siteInfo.userid)
        this.loadAvatar()
    }
  }

  /**
     * Function executed image clicked.
     */
  gotoProfile(event: any): void {
    if (this.siteInfo.userid) {
      event.preventDefault();
      event.stopPropagation();
      if (this.navCtrl.getActive().id == "UserProfilePage") {
        this.menuCtrl.close();
        return;
      }
      this.navCtrl.setRoot('UserProfilePage', { userId: this.siteInfo.userid, courseId: this.siteInfo.courseId })
      this.menuCtrl.close();
    }
  }

  goTo(page: string) {
    switch (page) {
      case "dashboard":
        if (this.navCtrl.getActive().id == "CoreMainMenuPage") {
          this.menuCtrl.close();
          return;
        }
        this.navCtrl.setRoot('CoreMainMenuPage');
        this.menuCtrl.close();
        break;
      case "teachers":
        if (this.navCtrl.getActive().id == "TeachersPage") {
          this.menuCtrl.close();
          return;
        }
        this.navCtrl.setRoot('TeachersPage');
        this.menuCtrl.close();
        break;
      case "tutorial":
        if (this.navCtrl.getActive().id == "TutorialPage") {
          this.menuCtrl.close();
          return;
        }
        this.navCtrl.setRoot('TutorialPage');
        this.menuCtrl.close();
        break;
      case "faq":
        if (this.navCtrl.getActive().id == "FaqPage") {
          this.menuCtrl.close();
          return;
        }
        this.navCtrl.setRoot('FaqPage');
        this.menuCtrl.close();
        break;
    }
  }
}
