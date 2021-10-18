import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  siteUrl: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private iab: InAppBrowser) {
    this.siteUrl = navParams.get('siteUrl');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }

  contact() {
    const browser = this.iab.create('https://mida.compagniadeicaraibi.com/midalogin?mode=CLIENTI', "self", { hidenavigationbuttons: "yes", hideurlbar: "yes", location: "no" });
    // location.href = "mailto:" + "password@juice.it" + '?subject=' + 'Recupero Password' + '&body=' + 'Salve, ho smarrito la mia password.';
  }

  goToLogin() {
    const params = { siteUrl: this.siteUrl };
    this.navCtrl.push('CoreLoginCredentialsPage', params);
  }
}
