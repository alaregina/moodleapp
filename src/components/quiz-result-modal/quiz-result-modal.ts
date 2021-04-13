import { Component, Input } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the QuizResultModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'quiz-result-modal',
  templateUrl: 'quiz-result-modal.html'
})
export class QuizResultModalComponent {
  feedback: any;
  constructor(params: NavParams, protected viewCtrl: ViewController) {
    this.feedback = !!params.get('feedback');
}
  dismiss(){
    this.viewCtrl.dismiss()
  }
}
