import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TeachersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-teachers',
  templateUrl: 'teachers.html',
})
export class TeachersPage {

  teachers_list: any[];
  course: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.teachers_list = [
      {
        id: 1,
        fullname: 'Nome1 Cognome1'
      },
      {
        id: 2,
        fullname: 'Nome2 Cognome2'
      },
      {
        id: 3,
        fullname: 'Nome3 Cognome3'
      },
      {
        id: 4,
        fullname: 'Nome4 Cognome4'
      },
      {
        id: 5,
        fullname: 'Nome5 Cognome5'
      },
      {
        id: 6,
        fullname: 'Nome6 Cognome6'
      },
    ];
    let data = navParams.data;
    if (data && JSON.stringify(data) != '{}') {
      this.teachers_list = data.teachers;
      this.course = data.course;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeachersPage');
  }

  goToTeacher(doc: any) {
    console.log('go to doc: ', doc);
    this.navCtrl.push('TeacherDetailPage', doc);
  }

}
