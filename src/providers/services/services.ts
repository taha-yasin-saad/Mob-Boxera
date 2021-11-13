import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import { Push, PushObject, PushOptions} from '@ionic-native/push';
import { Device } from '@ionic-native/device';

@Injectable()
export class ServicesProvider {

  ar: boolean = false;
  BtoaCode: any;
  user_id:any;
  UserName:any;
  UserEmail:any;
  cobon:any;
  service_url:any='http://boxaqra.co/boxera/public/api/';
  image_url:any='http://boxaqra.co/boxera/public/upload/';
  splash=true;
  token:any;
  
  constructor(private _http:Http ,
              public storage: Storage,
              private events: Events,
              private imagePicker: ImagePicker,
              private camera: Camera,
              public push: Push,
              private device: Device){


                this.check_userid();
    

  }

  image_path(){
    return this.image_url;
  }

  check_splash(){
    return this.splash;
  }

  set_splash(){
    this.splash=false;
  }

  check_userid(){
    this.storage.get('user_info').then(value => {
      if(value){
        console.log(value);
        this.user_id = JSON.parse(value).id;
        this.UserName = JSON.parse(value).name;
        this.UserEmail = JSON.parse(value).email;
      }else{
        this.user_id = false;
      }
    });
  }

  changeLang(){
    this.ar = !this.ar;
    // console.log(this.ar);
    this.storage.remove('language');
    this.storage.set('language', this.ar);
  }

  GetSetting(){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body = 'limit=5';            
    return this._http.get(this.service_url+'setting', options).map((res: Response) => res.json());
  };

  loged(data){
    let item = { 
      id: data.id,
      email: data.email,
      name: data.name,
      phone: data.phone
     };
    console.log(item);
    this.storage.set('user_info', JSON.stringify(item));
    this.events.publish('logout:changed');
  }

  sign(data){

  }

  isLoged(){
    return this.storage.get('user_info').then(value => value ? true : false)
  }

  isAuth(){
    
  }

  //// language Arabic = true & language English = false
  languages(){
    return this.storage.get('language').then(value => {
      if (!value) {
        //this.services.ar = true;
        this.storage.remove('language');
        this.storage.set('language', this.ar);
      } else {
        //this.services.ar = false;
        this.storage.remove('language');
        this.storage.set('language', !this.ar);
      }
    });
  }

  ImagePicker(){
    var promise = new Promise((resolve, reject) => {
      
            const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.DATA_URL,
              sourceType: this.camera.PictureSourceType.CAMERA,
              allowEdit: false,
              encodingType: this.camera.EncodingType.JPEG,
              // targetWidth: 100,
              // targetHeight: 1000,
              saveToPhotoAlbum: false,
              correctOrientation:true
            }
      
            this.imagePicker.getPictures(options).then((results) => {
              for (var i = 0; i < results.length; i++) {
      
                  (<any>window).resolveLocalFileSystemURL(results[i],
                    function (fileEntry) {
                        // convert to Base64 string
                        fileEntry.file(
                            function(file) {
                                //got file
                                var reader = new FileReader();
                                reader.onloadend =  (evt: any) => { 
                                  // this is your Base64 string
                                  resolve([evt.target.result]);
                                  //imgCover.push(evt.target.result);
                                };
                                reader.readAsDataURL(file);
                            }, 
                        function (evt) {
                            //failed to get file
                        });
                    }
                );
              }
            }, (err) => { });
      
      
            
            // this.camera.getPicture(options).then((imageData) => {
            //   // imageData is either a base64 encoded string or a file URI
            //   // If it's base64:
            //   imgData.push('data:image/jpeg;base64,' + imageData);
            //   console.log(this.image);
            //  }, (err) => {
            //   // Handle error
            //  });
      
          });

          return promise; 
  }

  Get_category(){
    console.log('user_id'+this.user_id);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
                // console.log(body + 'som3a');
            
    return this._http.get(this.service_url+'home?user_id='+this.user_id, options).map((res: Response) => res.json());
  }

  Get_category_books(id, offset = 0 ,search_key){
    console.log(offset);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body = 'limit=5'+
                '&offset=' + offset +
                '&user_id=' + this.user_id +
                '&category_id='+ id +
                '&search_key='+ search_key;
    return this._http.post(this.service_url+'get_product', body, options).map((res: Response) => res.json());
  }

  Get_category_books2(id, offset = 0 ,search_key){
    console.log(offset);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body = 'limit=5'+
                '&offset=' + offset +
                '&class_id='+ id +
                '&search_key='+ search_key;
    return this._http.post(this.service_url+'get_product', body, options).map((res: Response) => res.json());
  }
  
  get_categories(){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
            
    return this._http.get(this.service_url+'get_category_list', options).map((res: Response) => res.json());
  }

  search_books( offset = 0 ,search_key){
    console.log(offset);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body = 'limit=10'+
                '&offset=' + offset +
                '&search_key='+ search_key;
    return this._http.post(this.service_url+'get_product', body, options).map((res: Response) => res.json());
  }
  
  similar_books(id){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body = 'limit=5'+
                '&offset=0' + 
                '&category_id='+ id ;
    return this._http.post(this.service_url+'get_product', body, options).map((res: Response) => res.json());
  }

  Add_favourite(p_id){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body = 'user_id='+ this.user_id +
                '&product_id='+ p_id;
    return this._http.post(this.service_url+'add_to_favour', body, options).map((res: Response) => res.json());
  }

  Get_favouriteBooks(){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body = 'user_id='+ this.user_id;
    return this._http.post(this.service_url+'get_favour', body, options).map((res: Response) => res.json());
  }

  favoriteBook(BookId){
    this.storage.set('BookID'+BookId, true);
  }

  unfavoriteBook(BookId){
    this.storage.remove('BookID'+BookId);
  }

  isFavoriteBook(BookId){
    return this.storage.get('BookID'+BookId).then(value => value ? true : false);
  }

  Get_cardBooks(){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body = 'user_id='+ this.user_id;
    return this._http.post(this.service_url+'get_cart', body, options).map((res: Response) => res.json());
  }

  Add_card(p_id, quantity:any=0){
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });
      let body;
      if(quantity == 0){
        console.log(quantity);
        body =  'user_id='+ this.user_id+
                '&quantity=0'+
                '&product_id='+ p_id;
      }else{
        console.log(quantity);
        body =  'user_id='+ this.user_id +
                '&quantity='+ quantity +
                '&product_id='+ p_id;
      }
      return this._http.post(this.service_url+'add_to_cart', body, options).map((res: Response) => res.json());
  }

  CardBook(BookId){
    this.storage.set('ToCard'+BookId, true);
  }

  removeCardBook(BookId){
    this.storage.remove('ToCard'+BookId);
  }

  isCardeBook(BookId){
    return this.storage.get('ToCard'+BookId).then(value => value ? true : false);
  }

  login(data){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body =  'email='+ data.email+
                '&password='+ data.password+
                '&token='+data.token+
                '&device='+data.device;        
    return this._http.post(this.service_url+'login', body, options).map((res: Response) => res.json());
  }

  resigter(data){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body =  'email='+ data.email+
                '&password='+ data.password+
                '&phone='+ data.phone +
                '&address='+ data.address+
                '&name='+ data.name;
    return this._http.post(this.service_url+'register', body, options).map((res: Response) => res.json());
  }

  forgetPassword(email){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body =  'email='+email;
    return this._http.post(this.service_url+'forget_password', body, options).map((res: Response) => res.json());
  }

  resetPassword(data){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body =  'code='+data.code+
                '&password='+data.password;
    return this._http.post(this.service_url+'reset_password', body, options).map((res: Response) => res.json());
  }

  Get_currency(){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body =  '';
    return this._http.get(this.service_url+'currency_list', options).map((res: Response) => res.json());
  }

  Get_Countrylist(){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    return this._http.get(this.service_url+'country_list', options).map((res: Response) => res.json());
  }

  Get_Country(){
    return this._http.get('http://freegeoip.net/json/').map((res: Response) => res.json());
  }
  
  check_order(CountryId, whatsapp, cobon){
    this.cobon=cobon;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body =  'user_id='+ this.user_id +
                '&country='+CountryId+
                '&whats_app='+whatsapp+
                '&cobon='+cobon;
                console.log(body);
                console.log(this.cobon);
    return this._http.post(this.service_url+'check_order', body, options).map((res: Response) => res.json());
  }

  submit_order(CountryId, whatsapp, name, address, home_number, city, state, street){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body =  'user_id='+ this.user_id +
                '&country='+CountryId+
                '&whats_app='+whatsapp+
                '&name='+name+
                '&address='+address+
                '&home_number='+home_number+
                '&city='+city+
                '&state='+state+
                '&street='+street+
                '&cobon='+this.cobon;
                console.log(body);

    this.cobon='';
    return this._http.post(this.service_url+'submit_order', body, options).map((res: Response) => res.json());
  }

  order_status(offset){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body =  'user_id='+ this.user_id+
                '&limit=5'+
                '&offset='+offset;
                console.log(body);
    return this._http.post(this.service_url+'order_list', body, options).map((res: Response) => res.json());
  }

  currency(currency){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body =  'user_id='+ this.user_id+
                '&currency='+currency;
                console.log(body);
    return this._http.post(this.service_url+'edit_currency', body, options).map((res: Response) => res.json());
  }

  order_rate(order_id, rate){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    let body =  'user_id='+ this.user_id+
                '&rate='+rate+
                '&order_id='+order_id;
                console.log(body);
    return this._http.post(this.service_url+'order_rate', body, options).map((res: Response) => res.json());
  }

  slides(){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    return this._http.get(this.service_url+'slides', options).map((res: Response) => res.json());
  }

}
