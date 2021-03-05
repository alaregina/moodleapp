import { Component } from '@angular/core';
import { CoreCoursesProvider } from '@core/courses/providers/courses';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
  categoryId: any;
  courses: any[] = [];
  coursesLoaded: boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private coursesProvider: CoreCoursesProvider) {
  }

  ionViewDidLoad() {
    this.categoryId = this.navParams.get('categoryId');
    console.log(this.categoryId);
    this.fetchCourses().finally(()=>{
      this.coursesLoaded = true;
    })
  }

  fetchCourses(){
    return this.coursesProvider.getCoursesByField('category', this.categoryId).then(courses=>{
      console.log(courses);
      this.courses = courses;
    })
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
