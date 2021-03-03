import { Component, Optional } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { TranslateService } from '@ngx-translate/core';
import { CoreCoursesProvider } from '@core/courses/providers/courses';
import { CoreEventsProvider } from '@providers/events';
import { CoreSitesProvider } from '@providers/sites';
import { CoreMimetypeUtilsProvider } from '@providers/utils/mimetype';
import { CoreFileUploaderHelperProvider } from '@core/fileuploader/providers/helper';
import { CoreSplitViewComponent } from '@components/split-view/split-view';
import { CoreUserDelegate, CoreUserProfileHandlerData } from '@core/user/providers/user-delegate';
import { CoreUserProvider } from '@core/user/providers/user';
import { CoreUserHelperProvider } from '@core/user/providers/helper';


/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({segment: 'page-user-profile'})
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  protected courseId: number;
  protected userId: number;
  protected site;
  protected obsProfileRefreshed: any;
  protected subscription;

  completedCourses: number = 0;
  ongoingCourses: number = 0;
  userLoaded = false;
  isLoadingHandlers = false;
  user: any;
  title: string;
  isDeleted = false;
  isEnrolled = true;
  canChangeProfilePicture = false;
  actionHandlers: CoreUserProfileHandlerData[] = [];
  newPageHandlers: CoreUserProfileHandlerData[] = [];
  communicationHandlers: CoreUserProfileHandlerData[] = [];

  constructor(navParams: NavParams, private userProvider: CoreUserProvider, private userHelper: CoreUserHelperProvider,
          private domUtils: CoreDomUtilsProvider, private translate: TranslateService, private eventsProvider: CoreEventsProvider,
          private coursesProvider: CoreCoursesProvider, private sitesProvider: CoreSitesProvider,
          private mimetypeUtils: CoreMimetypeUtilsProvider, private fileUploaderHelper: CoreFileUploaderHelperProvider,
          private userDelegate: CoreUserDelegate, private navCtrl: NavController,
          @Optional() private svComponent: CoreSplitViewComponent) {
      this.userId = navParams.get('userId');
      this.courseId = navParams.get('courseId');

      this.site = this.sitesProvider.getCurrentSite();

      // Allow to change the profile image only in the app profile page.
      this.canChangeProfilePicture =
          (!this.courseId || this.courseId == this.site.getSiteHomeId()) &&
          this.userId == this.site.getUserId() &&
          this.site.canUploadFiles() &&
          this.site.wsAvailable('core_user_update_picture') &&
          !this.userProvider.isUpdatePictureDisabledInSite(this.site);

      this.obsProfileRefreshed = eventsProvider.on(CoreUserProvider.PROFILE_REFRESHED, (data) => {
          if (this.user && typeof data.user != 'undefined') {
              this.user.email = data.user.email;
              this.user.address = this.userHelper.formatAddress('', data.user.city, data.user.country);
          }
      }, sitesProvider.getCurrentSiteId());
  }

  /**
   * View loaded.
   */
  ionViewDidLoad(): void {
      this.fetchUser().then(() => {
          this.coursesProvider.getUserCourses().then((courses:any[])=>{
            this.completedCourses = courses.filter(x=>x.completed==true).length
            this.ongoingCourses = courses.length - this.completedCourses
          })
          return this.userProvider.logView(this.userId, this.courseId, this.user.fullname).catch((error) => {
              this.isDeleted = error.errorcode === 'userdeleted';
              this.isEnrolled = error.errorcode !== 'notenrolledprofile';
          });
      }).finally(() => {
          this.userLoaded = true;
      });
  }

  /**
   * Fetches the user and updates the view.
   */
  fetchUser(): Promise<any> {
      return this.userProvider.getProfile(this.userId, this.courseId).then((user) => {

          user.address = this.userHelper.formatAddress('', user.city, user.country);
          user.roles = this.userHelper.formatRoleList(user.roles);

          this.user = user;
          this.title = user.fullname;

          // If there's already a subscription, unsubscribe because we'll get a new one.
          this.subscription && this.subscription.unsubscribe();

          this.subscription = this.userDelegate.getProfileHandlersFor(user, this.courseId).subscribe((handlers) => {
              this.actionHandlers = [];
              this.newPageHandlers = [];
              this.communicationHandlers = [];
              handlers.forEach((handler) => {
                  switch (handler.type) {
                      case CoreUserDelegate.TYPE_COMMUNICATION:
                          this.communicationHandlers.push(handler.data);
                          break;
                      case CoreUserDelegate.TYPE_ACTION:
                          this.actionHandlers.push(handler.data);
                          break;
                      case CoreUserDelegate.TYPE_NEW_PAGE:
                      default:
                          this.newPageHandlers.push(handler.data);
                          break;
                  }
              });

              this.isLoadingHandlers = !this.userDelegate.areHandlersLoaded(user.id);
          });

          if (this.userId == this.site.getUserId() && user.profileimageurl != this.site.getInfo().userpictureurl) {
              // The current user image received is different than the one stored in site info. Assume the image was updated.
              // Update the site info to get the right avatar in there.
              return this.sitesProvider.updateSiteInfo(this.site.getId()).then(() => {
                  if (user.profileimageurl != this.site.getInfo().userpictureurl) {
                      // The image is still different, this means that the good one is the one in site info.
                      return this.refreshUser();
                  } else {
                      // Now they're the same, send event to use the right avatar in the rest of the app.
                      this.eventsProvider.trigger(CoreUserProvider.PROFILE_PICTURE_UPDATED, {
                          userId: this.userId,
                          picture: user.profileimageurl
                      }, this.site.getId());
                  }
              }, () => {
                  // Cannot update site info. Assume the profile image is the right one.
                  this.eventsProvider.trigger(CoreUserProvider.PROFILE_PICTURE_UPDATED, {
                      userId: this.userId,
                      picture: user.profileimageurl
                  }, this.site.getId());
              });
          }

      }).catch((error) => {
          // Error is null for deleted users, do not show the modal.
          if (error) {
              this.domUtils.showErrorModal(error);
          }
      });
  }

  /**
   * Opens dialog to change profile picture.
   */
  changeProfilePicture(): Promise<any> {
      const maxSize = -1,
          title = this.translate.instant('core.user.newpicture'),
          mimetypes = this.mimetypeUtils.getGroupMimeInfo('image', 'mimetypes');

      return this.fileUploaderHelper.selectAndUploadFile(maxSize, title, mimetypes).then((result) => {
          const modal = this.domUtils.showModalLoading('core.sending', true);

          return this.userProvider.changeProfilePicture(result.itemid, this.userId).then((profileImageURL) => {
              this.eventsProvider.trigger(CoreUserProvider.PROFILE_PICTURE_UPDATED, {
                  userId: this.userId,
                  picture: profileImageURL
              }, this.site.getId());
              this.sitesProvider.updateSiteInfo(this.site.getId());
              this.refreshUser();
          }).finally(() => {
              modal.dismiss();
          });
      }).catch((message) => {
          if (message) {
              this.domUtils.showErrorModal(message);
          }
      });
  }

  /**
   * Refresh the user.
   *
   * @param refresher Refresher.
   */
  refreshUser(refresher?: any): void {
      const promises = [];

      promises.push(this.userProvider.invalidateUserCache(this.userId));
      promises.push(this.coursesProvider.invalidateUserNavigationOptions());
      promises.push(this.coursesProvider.invalidateUserAdministrationOptions());

      Promise.all(promises).finally(() => {
          this.fetchUser().finally(() => {
              this.eventsProvider.trigger(CoreUserProvider.PROFILE_REFRESHED, {
                  courseId: this.courseId,
                  userId: this.userId,
                  user: this.user
              }, this.site.getId());
              refresher && refresher.complete();
          });
      });
  }

  /**
   * Open the page with the user details.
   */
  openUserDetails(): void {
      // Decide which navCtrl to use. If this page is inside a split view, use the split view's master nav.
      const navCtrl = this.svComponent ? this.svComponent.getMasterNav() : this.navCtrl;
      navCtrl.push('CoreUserAboutPage', {courseId: this.courseId, userId: this.userId});
  }

  /**
   * A handler was clicked.
   *
   * @param event Click event.
   * @param handler Handler that was clicked.
   */
  handlerClicked(event: Event, handler: CoreUserProfileHandlerData): void {
      // Decide which navCtrl to use. If this page is inside a split view, use the split view's master nav.
      const navCtrl = this.svComponent ? this.svComponent.getMasterNav() : this.navCtrl;
      handler.action(event, navCtrl, this.user, this.courseId);
  }

  /**
   * Page destroyed.
   */
  ngOnDestroy(): void {
      this.subscription && this.subscription.unsubscribe();
      this.obsProfileRefreshed && this.obsProfileRefreshed.off();
  }
}
