import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { MyBookPage } from '../my-book/my-book';
import { MyCartPage } from '../my-cart/my-cart';

@IonicPage()
@Component({
  selector: 'page-submit-order',
  templateUrl: 'submit-order.html',
})
export class SubmitOrderPage {

  info_order:any;
  country:any;
  whatsapp:any;
  name:any;
  address:any;
  home_number:any;
  city:any;
  state:any;
  street:any;
  BookID:any[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private services: ServicesProvider,
              public app: App) {

    this.info_order = navParams.data.OrderInfo;
    this.country = navParams.data.country;
    this.whatsapp = navParams.data.whatsapp;
    this.address = navParams.data.address;
    this.country = navParams.data.country;
    this.home_number = navParams.data.home_number;
    this.city = navParams.data.city;
    this.state = navParams.data.state;
    this.street = navParams.data.street;
    this.name = navParams.data.name;

    this.BookID = navParams.data.BookId;
    console.log(this.BookID);
    console.log(navParams.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubmitOrderPage');
    console.log(this.home_number);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  submit_order(){
    this.services.submit_order(this.country, this.whatsapp, this.name, this.address, this.home_number, this.city, this.state, this.street).subscribe(order => {
      console.log(order);
      if(order.code == 0){
        for(let ID of this.BookID){
          console.log(ID);
          this.services.removeCardBook(ID);
        }
        this.dismiss();
        this.app.getRootNav().setRoot( MyBookPage );
      }else{
        this.navCtrl.push(MyCartPage);        
      }
    })
  }

  cancel_order(){
    this.dismiss();
  }

}
