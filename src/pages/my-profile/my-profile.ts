import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App ,AlertController , ToastController ,LoadingController} from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { Storage } from '@ionic/storage';
import { MainPage } from '../main/main';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {

  testRadioOpen: boolean;
  testRadioResult;
  language:any;
  currency:any;
  isLogin: boolean = false;  
  currencies:any[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alerCtrl: AlertController,
              public storage: Storage, 
              public app :App,           
              public translate: TranslateService,              
              private services: ServicesProvider,
              private loadingController:LoadingController,              
              public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProfilePage');
    this.GetCurrency();
    this.IsLogin();
  }

  GetCurrency(){
    let loader = this.loadingController.create({
        content:"",
        duration: 10000
    });
    loader.present().then(() =>{
      this.services.Get_currency().subscribe(currency => {
        this.currencies=currency;
        loader.dismiss();
      });
    });
  }

  change_Currency(){
    this.services.currency(this.currency).subscribe(currency => {
      if(currency.code == 0){
        let toast = this.toastCtrl.create({
          message: 'تم تغير العمله ',
          duration: 3000
        });
        toast.present();
        this.services.storage.set('currency', this.currency);
      }
    })
  } 
 
  change_language(){
    this.storage.set("lang",this.language);
    this.translate.use(this.language);
  }

  IsLogin(){
    this.services.isLoged().then(value => {
      if(value){
        console.log('1');
        this.isLogin = true;
      }else{
        console.log('2');        
        this.isLogin = false;
      }
    })
  }

  doRadio() {
    let alert = this.alerCtrl.create();
    alert.setTitle('Choose Language');

    alert.addInput({
      type: 'radio',
      label: 'English',
      value: '1',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'عربى',
      value: '2'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log('Radio data:', data);
        this.testRadioOpen = false;
        this.testRadioResult = data;
      }
    });

    alert.present().then(() => {
      this.testRadioOpen = true;
    });
  }

}
