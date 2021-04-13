import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the QuizFeedbackModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quiz-feedback-modal',
  templateUrl: 'quiz-feedback-modal.html',
})
export class QuizFeedbackModalPage {
  resultInfo: any;
  percentage: number;
  constructor(params: NavParams, protected viewCtrl: ViewController) {
    this.resultInfo = params.get('feedback');
    let correct:number = +(this.resultInfo.readableMark as string).split("/")[0].replace(",", ".")
    let total:number = +(this.resultInfo.readableMark as string).split("/")[1]
    this.percentage = (correct / total) * 100;
  }

  dismiss(){
    this.viewCtrl.dismiss()
  }
}
