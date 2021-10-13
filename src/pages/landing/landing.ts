import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CoreLoginHelperProvider } from '@core/login/providers/helper';
import { CoreAppProvider } from '@providers/app';
import { LoginMidaProvider } from '@providers/login-mida/login-mida';
import { CoreSitesProvider } from '@providers/sites';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({ segment: 'pages-page-landing' })
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage implements OnInit {

  siteUrl: string;
  credForm: FormGroup;
  protected siteId: string;
  protected urlToOpen: string;

  @ViewChild('credentialsForm') formElement: ElementRef;

  constructor(public navCtrl: NavController,
    private appProvider: CoreAppProvider,
    fb: FormBuilder,
    private sitesProvider: CoreSitesProvider,
    private domUtils: CoreDomUtilsProvider,
    public navParams: NavParams,
    private loginHelper: CoreLoginHelperProvider,
    private loginMidaProvider: LoginMidaProvider) {
    this.siteUrl = navParams.get('siteUrl');
    this.urlToOpen = navParams.get('urlToOpen');
    this.credForm = fb.group({
      username: [navParams.get('username') || '', Validators.required],
      password: ['', Validators.required]
    });

  }
  ngOnInit(): void {
  }

  ionViewDidLoad() {
  }

  help() {
    this.navCtrl.push('HelpPage', { 'siteUrl': this.siteUrl });
  }

  // goToLogin() {
  //   const params = { siteUrl: this.siteUrl };
  //   this.navCtrl.push('CoreLoginCredentialsPage', params);
  // }

  // goToMIDALogin(): void {
  //   const params = { siteUrl: this.siteUrl };
  //   this.navCtrl.push('LoginMidaPage', params);
  // }

  login() {
    this.appProvider.closeKeyboard();

    // Get input data.
    const siteUrl = this.siteUrl;
    const username = this.credForm.value.username || "1_ag01@cdc.ag";
    const password = this.credForm.value.password || "12345678";
    if (!username) {
      this.domUtils.showErrorModal('core.login.usernamerequired', true);

      return;
    }
    if (!password) {
      this.domUtils.showErrorModal('core.login.passwordrequired', true);

      return;
    }

    if (!this.appProvider.isOnline()) {
      this.domUtils.showErrorModal('core.networkerrormsg', true);

      return;
    }
    const modal = this.domUtils.showModalLoading();
    this.loginMidaProvider.loginMIDA(username, password).then((data) => {
      var systemToken = "9810399b65db8309f8b3c80a346261f6";//mettere in un config
      console.log(data.access_token)
      console.log(systemToken)
      console.log(siteUrl)
      this.loginMidaProvider.loginMoodle(data.access_token, systemToken, siteUrl).then((tokenresponse) => {
        const modal2 = this.domUtils.showModalLoading();
        console.log(tokenresponse)
        if (!!tokenresponse.token) {
          localStorage.setItem('token', tokenresponse.token);
          return this.sitesProvider.newSite(tokenresponse.siteUrl, tokenresponse.token, tokenresponse.privateToken).then((id) => {
            // Reset fields so the data is not in the view anymore.
            this.credForm.controls['username'].reset();
            this.credForm.controls['password'].reset();

            this.siteId = id;
            modal2.dismiss();
            return this.loginHelper.goToSiteInitialPage(undefined, undefined, undefined, undefined, this.urlToOpen);
          });
        }
      }).catch(err => console.log(err))
    }).catch((error) => {
      console.log("🚀 ~ file: login-mida.ts ~ line 93 ~ LoginMidaPage ~ this.loginMidaProvider.loginMIDA ~ error", error);
    }).finally(() => {
      modal.dismiss();

      this.domUtils.triggerFormSubmittedEvent(this.formElement, true);
    });

  }
}
