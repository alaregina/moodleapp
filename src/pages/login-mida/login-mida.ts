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
        const username = this.credForm.value.username || "nicola@lacasadelrum.it";
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
        this.sitesProvider.getUserToken(siteUrl, 'systemuser', 'Systemuser!1192$2').then((response)=>{
          //per usare l'api di autenticazione con token serve un token quindi ho creato un'utenza di sistema systemuser
          this.loginMidaProvider.loginMIDA(username, password).then((data) => {
            //MIDA deve mandarci un token come questo sotto
            //data.access_token="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXIiOnsiVWlkIjoiQzAwMDA5IiwiRW1haWwiOiJuaWNvbGFAbGFjYXNhZGVscnVtLml0IiwiRGlzcGxheU5hbWUiOiJCQVIgQkFHTk8gUk9NQSBTLkEuUy4gREkgUlVGSU5JIEZSQU5DRVNDTyAmIEMuIiwiRmlyc3ROYW1lIjoiTmljb2xhIiwiTGFzdE5hbWUiOiJMYUNhc2FEZWxSdW0iLCJOaWNrTmFtZSI6Im5pY29sYSIsIlJvbGUiOiJjbGllbnRlL21hc3RlciIsIlBlcm1pc3Npb25zIjoiU3Bpcml0In19fQ.H_0r8xJkSuw1W7vogzEaGNdU1I_xNuLRkE20rJTHZ26h4XNIWj_ABbCq18F_EwHif-NcB4uv4JAqiSuc208orvBZX7xEc5cRTShVGMoaK5Tv2d6tUxotKQFhs_tniQq58oQo1HKnOuMDpSW5mxozou6p7PNou0u2mwj32j8S3GUaEVEv75p4IJU0kZFBJ5JJGPrR17cesI_vBtQ8I47c4WKM9hwEFuAZFTjqzbGl35Q2RH-InOf_HC11GIiolZhGGbOyZ4AdnSfuL7AVKr9Pk9CuJjRsvujHhq_mTWigHemxxA1_GesmUDFNwB3cDUKovOHPrS7rkEcVG12PuLtSdQ"
            this.loginMidaProvider.loginMoodle(data.access_token, response.token, siteUrl).then((tokenresponse)=>{
              return this.sitesProvider.newSite(tokenresponse.siteUrl, tokenresponse.token, tokenresponse.privateToken).then((id) => {
                // Reset fields so the data is not in the view anymore.
                this.credForm.controls['username'].reset();
                this.credForm.controls['password'].reset();

                this.siteId = id;
                return this.loginHelper.goToSiteInitialPage(undefined, undefined, undefined, undefined, this.urlToOpen);
            });
            })
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            modal.dismiss();
        });
        })
        
  }
}
