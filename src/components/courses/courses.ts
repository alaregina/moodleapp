import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CoreCourseHelperProvider } from '@core/course/providers/helper';
import { CoreCoursesProvider } from '@core/courses/providers/courses';
import { CoreCoursesHelperProvider } from '@core/courses/providers/helper';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { NavController, NavParams, Slides, ViewController } from 'ionic-angular';

/**
 * Generated class for the CoursesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'courses',
  templateUrl: 'courses.html'
})
export class CoursesComponent implements OnChanges {
  @ViewChild(Slides) slides: Slides;
  @Input("categoryId") categoryId: number;
  @Output() close = new EventEmitter<string>();
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
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.categoryId)
      this.fetchCourses().finally(()=>{
        this.coursesLoaded = true;
      })
  }

  ionViewDidEnter() {
    // this.slides.centeredSlides = true;
    this.fetchCourses().finally(()=>{
      this.coursesLoaded = true;
    })
  }
  favourite(courses){
    return this.courses.filter(c=>c.isfavourite).length==0 ? this.courses:this.courses.filter(c=>c.isfavourite)
  }
  highlighted(courses){
    return this.courses.filter(c=>c.highlight).length==0 ? this.courses:this.courses.filter(c=>c.highlight)
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
          promises.push(courses.forEach(course=>{
            this.coursesProvider.getCourseByField('id', course.id).then((c) => {
              let hightlight = (c.customfields as any[]).find(x=>x.name=="Highlight")
              course.highlight = !!hightlight ? (+hightlight.valueraw) : false
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

  dismiss(){
    this.close.emit("close")
  }

  viewAllCourses(){
    this.navCtrl.push("CoreCoursesMyCoursesPage")
  }

}
