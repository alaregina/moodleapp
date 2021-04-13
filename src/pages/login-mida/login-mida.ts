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
        this.sitesProvider.getUserToken(siteUrl, 'systemuser', 'Systemuser!1192$2').then((response)=>{
          //per usare l'api di autenticazione con token serve un token quindi ho creato un'utenza di sistema systemuser
          this.loginMidaProvider.loginMIDA(username, password).then((data) => {
            //MIDA deve mandarci un token come questo sotto
            data.access_token="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjEzNzI5MDIyLCJleHAiOjE2MTM3NTkwMjIsImRhdGEiOnsidXNlciI6eyJ1c2VybmFtZSI6Imp3dHVzZXIxIiwiaWRudW1iZXIiOiIiLCJmaXJzdG5hbWUiOiJqd3RVc2VyIiwibGFzdG5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJqd3R1c2VyQHRlc3QxLml0IiwiaWNxIjoiIiwic2t5cGUiOiIiLCJ5YWhvbyI6IiIsImFpbSI6IiIsIm1zbiI6IiIsInBob25lMSI6IiIsInBob25lMiI6IiIsImluc3RpdHV0aW9uIjoiIiwiZGVwYXJ0bWVudCI6IiIsImFkZHJlc3MiOiIiLCJjaXR5IjoiIiwiY291bnRyeSI6IiIsImxhbmciOiIiLCJ0aW1lem9uZSI6IiJ9fX0.BOX6YxMrimZ_qt4bS9kfUzg3kMSbVmquoY3nJe93-J970DTB31vb3rGM4B8XzLW_AV-v5lQ3t1S8bNrKC00beb6244eTzQzDjrPQJiPUMTpp4eMbtOyeWSsWsQld3N5O3uF90yNTs6j--v0Gr_uj06MbUE_1mtVOHstgcNHCpIiiL1xPxpWZkhFxcKcQ_ujqOHEeJt4JdHK2lh7bdlg_0AeeIdwJYGm21rjfp8Z7jrUQbZPNC9t2ra-d0_EJdUwZAGzXNzxgjlSjXJea3p7QZVt-vmlg6Cz4fpTJwWyTVyoe6dLLX5BVAZ8Tv_42PJQG1-gN3aBkIuRM64BCuADfEQ"
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
