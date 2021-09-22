import { Component, OnInit } from '@angular/core';
import { CoreSitesProvider } from '@providers/sites';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: 'pages-page-landing' })
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage implements OnInit {
  siteUrl: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private siteProvider: CoreSitesProvider) {
    this.siteUrl = navParams.get('siteUrl');

  }
  ngOnInit(): void {
  }

  ionViewDidLoad() {
  }

  goToLogin() {
    const params = { siteUrl: this.siteUrl };
    this.navCtrl.push('CoreLoginCredentialsPage', params);
  }

  goToMIDALogin(): void {
    const params = { siteUrl: this.siteUrl };
    this.navCtrl.push('LoginMidaPage', params);
  }

}
