import { AfterViewInit, Component } from '@angular/core';
import { CoreCourseHelperProvider } from '@core/course/providers/helper';
import { CoreCoursesProvider } from '@core/courses/providers/courses';
import { CoreCoursesHelperProvider } from '@core/courses/providers/helper';
import { CoreUserProvider } from '@core/user/providers/user';
import { CoreSitesProvider } from '@providers/sites';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreUtilsProvider } from '@providers/utils/utils';
import { Modal, ModalController, NavController } from 'ionic-angular';
import { CoursesModalPage } from '../../pages/courses-modal/courses-modal';
/**
 * Generated class for the JuicehomeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'juicehome',
  templateUrl: 'juicehome.html'
})
export class JuicehomeComponent implements AfterViewInit {

  text: string;
  categories: any[] = [];
  currentCategory: any;
  categoryId: number;
  title: any;
  courses: any[];
  categoriesLoaded: boolean = false;
  userLoaded: boolean = false;
  user: any = {};
  selectedCategory: number = -1;
  modal: Modal;


  constructor(private navCtrl: NavController, 
    private domUtils: CoreDomUtilsProvider, 
    private utils: CoreUtilsProvider, 
    private sitesProvider: CoreSitesProvider,
    private userProvider: CoreUserProvider,
    private coursesProvider:CoreCoursesProvider,
    private modalController: ModalController) {
    
  }
  ngAfterViewInit(): void {
    this.fetchUser().finally(()=>{
      this.userLoaded = true;
    });
    this.fetchCategories().finally(() => {
        this.categoriesLoaded = true;
    });
  }
  protected fetchUser(): Promise<any> {
    var userId = this.sitesProvider.getCurrentSite().getUserId();
    return this.userProvider.getProfile(userId).then((user)=>{
      this.user = user;
    })
  }

  /**
     * Fetch the categories.
     *
     * @return Promise resolved when done.
     */
    protected fetchCategories(): Promise<any> {
      return this.coursesProvider.getCategories(0, true).then((cats) => {
          this.currentCategory = undefined;
          cats.sort((a, b) => {
              if (a.depth == b.depth) {
                  return (a.sortorder > b.sortorder) ? 1 : ((b.sortorder > a.sortorder) ? -1 : 0);
              }

              return a.depth > b.depth ? 1 : -1;
          });
          this.categories = cats.filter(x=>x.depth==3)
         
      }).catch((error) => {
          this.domUtils.showErrorModalDefault(error, 'core.courses.errorloadcategories', true);
      });
  }

  /**
     * Refresh the categories.
     *
     * @param refresher Refresher.
     */
    refreshCategories(refresher: any): void {
      const promises = [];

      promises.push(this.coursesProvider.invalidateUserCourses());
      promises.push(this.coursesProvider.invalidateCategories(this.categoryId, true));
      promises.push(this.coursesProvider.invalidateCoursesByField('category', this.categoryId));
      promises.push(this.sitesProvider.getCurrentSite().invalidateConfig());

      Promise.all(promises).finally(() => {
          this.fetchCategories().finally(() => {
              refresher.complete();
          });
      });
  }
  
  /**
     * Open a category.
     *
     * @param categoryId The category ID.
     */
   async openCategory(categoryId: number) {
    if (this.selectedCategory == categoryId)
    {
      this.selectedCategory = -1;
      this.modal.dismiss();
    } else {
      this.selectedCategory = categoryId;
      document.getElementsByTagName("ion-app")[0].classList.add("modal-opened");
      this.modal = this.modalController.create(CoursesModalPage, { categoryId: categoryId }, {cssClass: "small-modal", showBackdrop:true, enableBackdropDismiss: true})
      this.modal.onDidDismiss(()=>{
        this.selectedCategory = -1;
        document.getElementsByTagName("ion-app")[0].classList.remove("modal-opened");
      })
      await this.modal.present()
    }
    //this.navCtrl.push('CoreCoursesCategoriesPage', { categoryId: categoryId });
}



//     /**
//      * Open a category.
//      *
//      * @param categoryId The category ID.
//      */
//     async openCategory(categoryId: number) {
//       if (this.selectedCategory == categoryId)
//       {
//         this.selectedCategory = null;
//       } else {
//         this.selectedCategory = categoryId;
//         this.fetchCourses().finally(()=>{
//           this.coursesLoaded = true;
//         })
//       }
//       //this.navCtrl.push('CoreCoursesCategoriesPage', { categoryId: categoryId });
//   }

//   dismiss(){
//     // this.viewCtrl.dismiss();
//   }

//   viewAllCourses(){
//     this.navCtrl.push("CoreCoursesMyCoursesPage")
//   }

//   /**
//      * Fetch the user courses.
//      *
//      * @return Promise resolved when done.
//      */
//    protected fetchCourses(): Promise<any> {
//     return this.coursesProvider.getUserCourses().then((courses) => {
//         const promises = [],
//             courseIds = courses.map((course) => {
//             return course.id;
//         });

//         this.courseIds = courseIds.join(',');

//         promises.push(this.coursesHelper.loadCoursesExtraInfo(courses));

//         if (this.coursesProvider.canGetAdminAndNavOptions()) {
//             promises.push(this.coursesProvider.getCoursesAdminAndNavOptions(courseIds).then((options) => {
//                 courses.forEach((course) => {
//                     course.navOptions = options.navOptions[course.id];
//                     course.admOptions = options.admOptions[course.id];
//                 });
//             }));
//         }

//         return Promise.all(promises).then(() => {
//             this.courses = courses;
//             this.initPrefetchCoursesIcon();
//         });
//     }).catch((error) => {
//         this.domUtils.showErrorModalDefault(error, 'core.courses.errorloadcourses', true);
//     });
// }



//   /**
//      * Initialize the prefetch icon for the list of courses.
//      */
//    protected initPrefetchCoursesIcon(): void {
//     if (this.prefetchIconInitialized || !this.downloadAllCoursesEnabled) {
//         // Already initialized.
//         return;
//     }

//     this.prefetchIconInitialized = true;

//     if (!this.courses || this.courses.length < 2) {
//         // Not enough courses.
//         this.prefetchCoursesData.icon = '';

//         return;
//     }

//     this.courseHelper.determineCoursesStatus(this.courses).then((status) => {
//         let icon = this.courseHelper.getCourseStatusIconAndTitleFromStatus(status).icon;
//         if (icon == 'spinner') {
//             // It seems all courses are being downloaded, show a download button instead.
//             icon = 'cloud-download';
//         }
//         this.prefetchCoursesData.icon = icon;
//     });
// }

}
