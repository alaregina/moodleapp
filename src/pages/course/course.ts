import { Component } from '@angular/core';
import { CoreCourseHelperProvider } from '@core/course/providers/helper';
import { CoreCoursesProvider } from '@core/courses/providers/courses';
import { CoreCoursesHelperProvider } from '@core/courses/providers/helper';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CoursePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course',
  templateUrl: 'course.html',
})
export class CoursePage {
  category: any;
  courseIds: string;
  prefetchIconInitialized: boolean;
  downloadAllCoursesEnabled: any;
  courses: any;
  prefetchCoursesData: any;
  coursesLoaded: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private coursesProvider: CoreCoursesProvider, private coursesHelper:CoreCoursesHelperProvider,
    private courseHelper: CoreCourseHelperProvider,
    private domUtils: CoreDomUtilsProvider) {
    this.category = navParams.get('category');
    this.fetchCourses().finally(()=>{
      this.coursesLoaded = true;
    })
  }
  refreshCourses(refresher){
    this.fetchCourses().finally(()=>{
      refresher.complete();
      this.coursesLoaded = true;
    })
  }
  ionViewDidLoad() {
    
  }

  protected fetchCourses(): Promise<any> {
    return this.coursesProvider.getUserCourses().then((courses) => {
        courses = courses.filter(c=>c.category==this.category.id)
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
        promises.push(courses.forEach(course=>{
          this.coursesProvider.getCourseByField('id', course.id).then((c) => {
            let hightlight = (c.customfields as any[]).find(x=>x.shortname=="highlight")
            course.highlight = !!hightlight ? (+hightlight.valueraw) : false
            let percorso_tematico = (c.customfields as any[]).find(x=>x.shortname=="percorso_tematico")
            course.thematicRoutes = !!percorso_tematico ? (+percorso_tematico.valueraw) : false
          });
        }))
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
  /**
     * Open a course.
     *
     * @param course The course to open.
     */
  openCourse(course: any): void {
    this.courseHelper.openCourse(this.navCtrl, course);
  }
}
