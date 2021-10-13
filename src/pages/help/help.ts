import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  siteUrl: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.siteUrl = navParams.get('siteUrl');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }

  contact() {
    location.href = "mailto:" + "password@juice.it" + '?subject=' + 'Recupero Password' + '&body=' + 'Salve, ho smarrito la mia password.';
  }

  goToLogin() {
    const params = { siteUrl: this.siteUrl };
    this.navCtrl.push('CoreLoginCredentialsPage', params);
  }
}
