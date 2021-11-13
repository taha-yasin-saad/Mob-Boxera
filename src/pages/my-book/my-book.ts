import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { MainPage } from '../main/main';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-my-book',
  templateUrl: 'my-book.html',
})
export class MyBookPage {

  order_list:any[];
  offset:any = 0;
  HideLoadIcon = true;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private services: ServicesProvider,
              private loadingController:LoadingController,
              private alertCtrl: AlertController,
              private translateService: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyBookPage');
    this.order_status();
  }

  order_status(){
    let loader = this.loadingController.create({
        content:"",
        duration: 10000
    });
    loader.present().then(() =>{      
      this.services.order_status(this.offset ).subscribe(status => {
        this.order_list = status;
        console.log(status);
        loader.dismiss();
      })
    });
  }

  doInfinite(infiniteScroll) {
      setTimeout(() => {
        this.offset += 1;
        this.services.order_status(this.offset ).subscribe(orders =>{
          if(orders.length){
            for (var i = 0; i < orders.length; i++) {
              this.order_list.push( orders[i] );
            }
          }else{
            this.HideLoadIcon = false;
          }
        });
        infiniteScroll.complete();
      }, 500);
  }

  presentPrompt(order_id) {
      console.log("orser id : "+order_id);
      let alertTitle, alertPlaceholder, alertCancel, alertOk, alertRate;
      let navc = this.navCtrl;
      this.translateService.get('put_your_rate').subscribe(
        value => {
          alertTitle = value;
      });
      this.translateService.get('put_your_rate_number').subscribe(
        value => {
          alertPlaceholder = value;
      });
      this.translateService.get('ok').subscribe(
        value => {
          alertOk = value;
      });
      this.translateService.get('cancel').subscribe(
        value => {
          alertCancel = value;
      });
      let alert = this.alertCtrl.create({
        title: alertTitle,
        inputs: [
          {
            name: 'rate',
            placeholder: alertPlaceholder
          }
        ],
        buttons: [
          {
            text: alertCancel
          },
          {
            text: alertOk,
            handler: data => {
                    console.log(JSON.stringify(data)); //to see the object
                    console.log(data.rate);
                    alertRate = data.rate;
                    this.services.order_rate(order_id, data.rate).subscribe(books =>{
                        console.log(books);
                        navc.push(MainPage);
                    })
               }
          }
        ]
      });
      alert.present();
  } 

}
