import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';

import { BookInfoPage } from '../book-info/book-info';
import { SearchPage } from '../search/search';
// import { BooksListPage } from '../books-list/books-list';
// import { map } from 'rxjs/operator/map';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'setting.html',
})
export class SettingPage {

  setting: any[];
  public options: any;
  currency:any;
  stars:any[]= [];
  AllStars:any[]= [];
  length:any[] = [];
  map:any;
  connected: Subscription;
  disconnected: Subscription;
  

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private services: ServicesProvider,
              private loadingController:LoadingController,
              public network: Network,
              public toastCtrl: ToastController) {

    this.options = {
      slidesPerView: 2
    }
  }

  ionViewDidLoad() {
    this.GetSetting();
  }

  GetSetting(){
    let loader = this.loadingController.create({
        content:"",
        duration: 10000
    });
    loader.present().then(() =>{
      this.services.GetSetting().subscribe(setting => {
        this.setting = setting;        
        console.log(this.setting);
        this.map = new Map();
        loader.dismiss();
      });
    });
  };

 

}
