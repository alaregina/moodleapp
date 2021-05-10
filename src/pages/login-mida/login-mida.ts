import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginMidaProvider } from '@providers/login-mida/login-mida';
import { CoreAppProvider } from '@providers/app';
import { CoreDomUtilsProvider } from '@providers/utils/dom';
import { CoreSitesProvider } from '@providers/sites';
import { CoreLoginHelperProvider } from '@core/login/providers/helper';

/**
 * Generated class for the LoginMidaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: 'pages-login-mida' })
@Component({
  selector: 'page-login-mida',
  templateUrl: 'login-mida.html',
})
export class LoginMidaPage {
  @ViewChild('credentialsForm') formElement: ElementRef;

  siteUrl: string;
  credForm: FormGroup;
  protected siteId: string;
  protected urlToOpen: string;

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

  ionViewDidLoad() {
  }

  login(){
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
          this.loginMidaProvider.loginMoodle(data.access_token, systemToken, siteUrl).then((tokenresponse)=>{
            console.log(tokenresponse)
            if(!!tokenresponse.token){
              return this.sitesProvider.newSite(tokenresponse.siteUrl, tokenresponse.token, tokenresponse.privateToken).then((id) => {
                // Reset fields so the data is not in the view anymore.
                this.credForm.controls['username'].reset();
                this.credForm.controls['password'].reset();
  
                this.siteId = id;
                return this.loginHelper.goToSiteInitialPage(undefined, undefined, undefined, undefined, this.urlToOpen);
              });
            }
          }).catch(err=>console.log(err))
      }).catch((error) => {
          console.log(error)
      }).finally(() => {
          modal.dismiss();
      });
        
  }
}
