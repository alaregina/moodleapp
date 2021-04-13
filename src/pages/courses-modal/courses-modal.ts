import { Component, ViewChild } from '@angular/core';
import { CoreCourseHelperProvider } from '@core/course/providers/helper';
import { CoreCoursesProvider } from '@core/courses/providers/courses';
import { CoreCoursesHelperProvider } from '@core/courses/providers/helper';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { IonicPage, NavController, NavParams, Slides, ViewController } from 'ionic-angular';

/**
 * Generated class for the CoursesModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: 'courses-modal' })
@Component({
  selector: 'page-courses-modal',
  templateUrl: 'courses-modal.html',
})
export class CoursesModalPage {
  @ViewChild(Slides) slides: Slides;
  categoryId: any;
  courses: any[] = [];
  prefetchCoursesData: any = {};
  coursesLoaded: boolean = false;
  courseIds: string;
  prefetchIconInitialized: boolean;
  downloadAllCoursesEnabled: any;
  modalDragStart: { active: boolean; value: number; };

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private courseHelper: CoreCourseHelperProvider,
    private domUtils: CoreDomUtilsProvider, 
    private coursesProvider: CoreCoursesProvider,
    private coursesHelper: CoreCoursesHelperProvider) {
  }

  ionViewDidLoad() {
    this.categoryId = this.navParams.get('categoryId');
    // this.slides.centeredSlides = true;
    this.fetchCourses().finally(()=>{
      this.coursesLoaded = true;
    })
  }
  favourite(courses){
    return this.courses.filter(c=>c.isfavourite).length==0 ? this.courses:this.courses.filter(c=>c.isfavourite)
  }
  /**
     * Fetch the user courses.
     *
     * @return Promise resolved when done.
     */
    protected fetchCourses(): Promise<any> {
      return this.coursesProvider.getUserCourses().then((courses) => {
          const promises = [],
              courseIds = courses.map((course) => {
              return course.id;
          });

          this.courseIds = courseIds.join(',');

          promises.push(this.coursesHelper.loadCoursesExtraInfo(courses));

          if (this.coursesProvider.canGetAdminAndNavOptions()) {
              promises.push(this.coursesProvider.getCoursesAdminAndNavOptions(courseIds).then((options) => {
                  courses.forEach((course) => {
                      course.navOptions = options.navOptions[course.id];
                      course.admOptions = options.admOptions[course.id];
                  });
              }));
          }

          return Promise.all(promises).then(() => {
              this.courses = courses;
              this.initPrefetchCoursesIcon();
          });
      }).catch((error) => {
          this.domUtils.showErrorModalDefault(error, 'core.courses.errorloadcourses', true);
      });
  }

  /**
     * Initialize the prefetch icon for the list of courses.
     */
    protected initPrefetchCoursesIcon(): void {
      if (this.prefetchIconInitialized || !this.downloadAllCoursesEnabled) {
          // Already initialized.
          return;
      }

      this.prefetchIconInitialized = true;

      if (!this.courses || this.courses.length < 2) {
          // Not enough courses.
          this.prefetchCoursesData.icon = '';

          return;
      }

      this.courseHelper.determineCoursesStatus(this.courses).then((status) => {
          let icon = this.courseHelper.getCourseStatusIconAndTitleFromStatus(status).icon;
          if (icon == 'spinner') {
              // It seems all courses are being downloaded, show a download button instead.
              icon = 'cloud-download';
          }
          this.prefetchCoursesData.icon = icon;
      });
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  drag(event){
    if(event.additionalEvent=="pandown"){
      this.viewCtrl.dismiss();
    }
  }

  viewAllCourses(){
    this.navCtrl.push("CoreCoursesMyCoursesPage")
  }

}
