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
        image: '',
        fullname: 'Nome1 Cognome1',
        titolo: 'Titolo Specializzazione',
        faq: "<span><b>Dove sei Nato?</b></span><br><span>A Napoli nel 1982</span><br><br><span><b>Ci racconti il tuo mestiere?</b></span><br><span>Sono Brand Ambassador......</span><br><br>"
      },
      {
        id: 2,
        image: '',
        fullname: 'Nome2 Cognome2',
        titolo: 'Titolo Specializzazione',
        faq: "<span><b>Dove sei Nato?</b></span><br><span>A Napoli nel 1982</span><br><br><span><b>Ci racconti il tuo mestiere?</b></span><br><span>Sono Brand Ambassador......</span><br><br>"
      },
      {
        id: 3,
        image: '',
        fullname: 'Nome3 Cognome3',
        titolo: 'Titolo Specializzazione',
        faq: "<span><b>Dove sei Nato?</b></span><br><span>A Napoli nel 1982</span><br><br><span><b>Ci racconti il tuo mestiere?</b></span><br><span>Sono Brand Ambassador......</span><br><br>"
      },
      {
        id: 4,
        image: '',
        fullname: 'Nome4 Cognome4',
        titolo: 'Titolo Specializzazione',
        faq: "<span><b>Dove sei Nato?</b></span><br><span>A Napoli nel 1982</span><br><br><span><b>Ci racconti il tuo mestiere?</b></span><br><span>Sono Brand Ambassador......</span><br><br>"
      },
      {
        id: 5,
        image: '',
        fullname: 'Nome5 Cognome5',
        titolo: 'Titolo Specializzazione',
        faq: "<span><b>Dove sei Nato?</b></span><br><span>A Napoli nel 1982</span><br><br><span><b>Ci racconti il tuo mestiere?</b></span><br><span>Sono Brand Ambassador......</span><br><br>"
      },
      {
        id: 6,
        image: '',
        fullname: 'Nome6 Cognome6',
        titolo: 'Titolo Specializzazione',
        faq: "<span><b>Dove sei Nato?</b></span><br><span>A Napoli nel 1982</span><br><br><span><b>Ci racconti il tuo mestiere?</b></span><br><span>Sono Brand Ambassador......</span><br><br>"
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
