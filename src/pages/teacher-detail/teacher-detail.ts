import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TeacherDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-teacher-detail',
  templateUrl: 'teacher-detail.html',
})
export class TeacherDetailPage {

  detail_teacher: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.detail_teacher = navParams.data;
  }

  ionViewDidLoad() {
  }

}
