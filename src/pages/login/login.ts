import { SingletonProvider } from './../../providers/singleton/singleton';
import { UserServiceProvider } from './../../providers/user-service/user-service';
import { ErrorHandlerProvider } from './../../providers/error-handler/error-handler';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public todo: FormGroup;

  constructor(
    public errorProvider: ErrorHandlerProvider,
    private formBuilder: FormBuilder,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public singleton: SingletonProvider,
    public userProvider: UserServiceProvider
  ) {
    let userEmail;
    let userPassword
    this.todo = this.formBuilder.group({
        email: [userEmail || '', Validators.required],
        password: [userPassword || '', Validators.required],
    });
  }

  ionViewDidLoad() {
  }

  openRegisterPage() {
      this.navCtrl.push('RegisterPage');
  }

  login(){
		if(!this.singleton.isOnline()){
			this.singleton.presentToast("Conecte-se a internet e tente novamente");
			return;
		}
    if (this.todo.valid) {
      this.singleton.showLoading("Por favor aguarde, efetuando operação...");

      this.userProvider.login(this.todo.value.email, this.todo.value.password).then((data) => {
        this.singleton.dismissLoading();
          this.navCtrl.setRoot("TabsPage", {updateLists: true});
      }).catch((error) => {
        this.singleton.dismissLoading();
          this.singleton.presentToast(this.errorProvider.toString(error));
      });
    }
  }

}