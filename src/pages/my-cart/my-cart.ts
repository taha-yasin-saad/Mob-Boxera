import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { SubmitOrderPage } from '../submit-order/submit-order';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-my-cart',
  templateUrl: 'my-cart.html',
})
export class MyCartPage {

  cardBooks:any[];
  num:number[] = [];
  product_id:any;
  countries:any[];
  country:any;
  CountyName:any;
  BooksID:any[] =[];
  whatsapp:any;
  user_name:any;
  address:any;
  home_number:any;
  city:any;
  state:any;
  street:any;
  cobon:any;
  connected: Subscription;
  disconnected: Subscription;
  subscribtion = new Subscription;
  time:any;
  image_url:any;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private services: ServicesProvider,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              private loadingController:LoadingController,
              public storage: Storage,
              public network: Network) {
                this.image_url=this.services.image_path();

      this.storage.get('whatsapp').then((data)=>{
        this.whatsapp = data;
      });
      this.storage.get('user_name').then((data)=>{
        this.user_name = data;
      });
      this.storage.get('address').then((data)=>{
        this.address = data;
      });
      this.storage.get('home_number').then((data)=>{
        this.home_number = data;
      });
      this.storage.get('city').then((data)=>{
        this.city = data;
      });
      this.storage.get('state').then((data)=>{
        this.state = data;
      });
      this.storage.get('street').then((data)=>{
        this.street = data;
      });
                
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyCartPage');
    this.GetCardBooks();
  }

  ionViewDidEnter() {
    this.checkInternet();
  }

  ionViewWillLeave(){
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }

  checkInternet(){
    this.connected = this.network.onConnect().subscribe(data => {
      console.log(data);
      this.toastCtrl.create({
        message: `تم الاتصال بالانترنت`,
        showCloseButton: true,
        closeButtonText: 'Ok'
      }).present();
    }, error => console.error(error));
   
    this.disconnected = this.network.onDisconnect().subscribe(data => {
      console.log(data);
      this.toastCtrl.create({
        message: `تاكد من اتصالك بالانترنت`,
        showCloseButton: true,
        closeButtonText: 'Ok'
      }).present();
    }, error => console.error(error));
  }

  GetCardBooks(){
    let loader = this.loadingController.create({
        content:"",
        duration: 10000
    });
    loader.present().then(() =>{
      this.services.Get_cardBooks().subscribe(cardBooks => {
        if(cardBooks.length == 0){
          console.log(0);
        }else{
          this.GetCountry();
          this.GetCountryName();
          // setTimeout(function() {
          //   this.GetCountry().forEach((e) => {
          //     console.log(this.CountyName);
          //   })
          // }, 1500);
          
          console.log(2);
        }
        this.cardBooks = cardBooks;
        for (let book of this.cardBooks){
          this.num.push(parseInt(book.cart_quantity));
          this.BooksID.push(parseInt(book.p_id));
        }
        loader.dismiss();
      });
    });
  }

  GetCountry(){
    this.services.Get_Countrylist().subscribe(country => {
      this.countries = country;    
    })
  }

  GetCountryName(){
    this.services.Get_Country().subscribe(data =>{
      this.CountyName = data.country_name;
      setTimeout(e =>{
        this.countries.forEach(cou=>{
          if(cou.country_name==this.CountyName){
            this.country=cou.id;
            return false;            
          }
        });
      }, 1000);
      
    });
  }

  increase(i , P_id){
    clearTimeout(this.time);
    this.subscribtion.unsubscribe;
    this.time = setTimeout(() => {
      this.num[i] += 1 ;
      this.subscribtion.add(     
        this.services.Add_card(P_id , this.num[i]).subscribe(card => {})
      );
    }, 800);
  }

  decrease(i , P_id){
    if(this.num[i] == 1){
      return false;
    }else{
      clearTimeout(this.time);
      this.subscribtion.unsubscribe;
      this.time = setTimeout(() => {
        this.num[i] -= 1 ;
        this.subscribtion.add(     
          this.services.Add_card(P_id , this.num[i]).subscribe(card => {})
        );
      }, 800);
    }
  }

  deleted_book(P_id){
    clearTimeout(this.time);
    this.subscribtion.unsubscribe;
    this.time = setTimeout(() => {
      this.subscribtion.add(     
        
        this.services.Add_card(P_id).subscribe(card => {
          if(card.code == 0 || card.code == 2 ){
            this.services.CardBook(P_id)
          }else{
            this.services.removeCardBook(P_id)
          }
          this.GetCardBooks();
        })
      );
    }, 800);
  }

  order(){
    console.log(this.country);
    if(this.country == undefined){
      let toast = this.toastCtrl.create({
        message: 'برجاء قم باختيار الدوله',
        duration: 3000
      });
      toast.present();
    }else if(this.whatsapp == undefined || this.whatsapp == ''){
      let toast = this.toastCtrl.create({
        message: 'برجاء قم بادخال رقم الواتس ',
        duration: 3000
      });
      toast.present();
    }else if(this.user_name == undefined || this.user_name == ''){
      let toast = this.toastCtrl.create({
        message: 'برجاء أدخال الاسم بالكامل',
        duration: 3000
      });
      toast.present();
    }else if(this.address == undefined || this.address == ''){
      let toast = this.toastCtrl.create({
        message: 'برجاء قم بادخال العنوان ',
        duration: 3000
      });
      toast.present();
    }else if(this.state == undefined || this.state == ''){
      let toast = this.toastCtrl.create({
        message: 'برجاء قم بأدخال الحى',
        duration: 3000
      });
      toast.present();
    }else if(this.street == undefined || this.street == ''){
      let toast = this.toastCtrl.create({
        message: 'برجاء قم بادخال الشارع ',
        duration: 3000
      });
      toast.present();
    }else if(this.home_number == undefined || this.home_number == ''){
      let toast = this.toastCtrl.create({
        message: 'برجاء قم بادخال رقم المنزل',
        duration: 3000
      });
      toast.present();
    }else if(this.city == undefined || this.city == ''){
      let toast = this.toastCtrl.create({
        message: 'برجاء قم بادخال المدينة ',
        duration: 3000
      });
      toast.present();
    }
    else{
      clearTimeout(this.time);
      this.subscribtion.unsubscribe;
      this.time = setTimeout(() => {
        this.subscribtion.add(    
          this.services.check_order(this.country, this.whatsapp, this.cobon).subscribe(
            order => {
              console.log(order);
              this.storage.set("whatsapp",this.whatsapp);
              this.storage.set("user_name",this.user_name);
              this.storage.set("address",this.address);
              this.storage.set("home_number",this.home_number);
              this.storage.set("city",this.city);
              this.storage.set("state",this.state);
              this.storage.set("street",this.street);

              if(order.code == 0){
                let modal = this.modalCtrl.create(SubmitOrderPage, { OrderInfo: order , country: this.country, BookId: this.BooksID, whatsapp: this.whatsapp, name: this.user_name, address: this.address, home_number: this.home_number, city: this.city, state:this.state, street: this.street });
                modal.present();
              }else{
                let toast = this.toastCtrl.create({
                  message: order.msg,
                  duration: 3000
                });
                toast.present();
              }
            },
            error => {
              let toast = this.toastCtrl.create({
                message: 'ناسف , الشحن غير متوفر لتلك الدوله',
                duration: 3000
              });
              toast.present();
            }
          )
        );
      }, 800);
    }
  }

}
