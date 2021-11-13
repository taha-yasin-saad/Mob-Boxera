import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';

import { BookInfoPage } from '../book-info/book-info';
import { SearchPage } from '../search/search';
import { BooksListPage } from '../books-list/books-list';
// import { map } from 'rxjs/operator/map';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  categories: any[];
  slides: any[];
  public options: any;
  currency:any;
  stars:any[]= [];
  AllStars:any[]= [];
  length:any[] = [];
  map:any;
  connected: Subscription;
  disconnected: Subscription;
  subscribtion = new Subscription;
  
  image_url:any;
  isSearch = false;
  books:any[] = [];
  offset:any = 0;
  search_key:string = '';
  time:any;
  HideLoadIcon = true;

  public config: SwiperConfigInterface = {
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: false,
    pagination: false
  };

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private services: ServicesProvider,
              private loadingController:LoadingController,
              public network: Network,
              public toastCtrl: ToastController,
            public translate : TranslateService) {
    
    this.services.check_userid();
    this.options = {
      slidesPerView: 2
    }
    this.image_url=this.services.image_path();

  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.GetCategories();
      refresher.complete();
    }, 1000);
  }
  
  ionViewDidLoad() {
    this.GetCategories();
  }

  ionViewDidEnter() {
    this.checkInternet();
    this.GetCategories();
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

  PageBookInfo(book_info){
    this.navCtrl.push(BookInfoPage , { book_info: book_info });
  }
  
  PageSearch(){
    this.navCtrl.push(SearchPage);
  }

  GetCurrency(){
    this.services.Get_Country().subscribe(data =>{
      this.currency = data.country_code;
    });
  }

  getSlides(){
    this.services.slides().subscribe(slides =>{
      this.slides = slides;
    });
  }

  GetCategories(){
    let loader = this.loadingController.create({
        content:"",
        duration: 10000
    });
    loader.present().then(() =>{
      this.services.Get_category().subscribe(categories => {
        this.categories = categories;
        this.GetCurrency();
        console.log(this.categories);
        this.map = new Map();
        for (let category of this.categories){
          if(category.is_adv == false){
            for(let rate of category.product){
              this.map.set(rate.p_id , Array(parseInt(rate.rate)).map((x,i)=>i));
            }
          }
        }
        this.getSlides();
        loader.dismiss();
      });
    });
  }

  Go_Category(id, category_name){
    this.navCtrl.push(BooksListPage, { id: id, category_name: category_name });
  }

  getItems(ev: any) {
    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.subscribtion.unsubscribe;
      this.time = setTimeout(() => {
        this.subscribtion.add(
          this.services.search_books(this.offset, val).subscribe(books =>{
              console.log(val);
              console.log(books);
              this.books = books;
              this.isSearch = true;
              this.search_key = val;
          })
        );
      }, 800);
    } else {
      this.isSearch = false;
    }
  }

  doInfinite(infiniteScroll) {
    // console.log('Begin async operation');

    // return new Promise((resolve) => {
      setTimeout(() => {
        this.offset += 1;
        this.services.search_books( this.offset, this.search_key ).subscribe(books =>{
          let boo = books;
          
          if(boo.length){
            for (var i = 0; i < boo.length; i++) {
              this.books.push( boo[i] );
            }
          }else{
            this.HideLoadIcon = false;
          }
        });
        // console.log('Async operation has ended');
        // resolve();
        infiniteScroll.complete();
      }, 500);
    // })
  }

}
