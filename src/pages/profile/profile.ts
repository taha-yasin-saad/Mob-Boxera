import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ToastController, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ServicesProvider } from '../../providers/services/services';
import { MainPage } from '../main/main';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
	whatsapp:any;
	user_name:any;
	address:any;
	home_number:any;
	city:any;
	state:any;
	street:any;
	countries:any[];
	country:any;
	CountyName:any;

	constructor(
	public navCtrl: NavController,
	public navParams: NavParams, 
	public toastCtrl: ToastController, 
	public storage: Storage,
	public app: App,
	private services: ServicesProvider) {
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
		console.log('ionViewDidLoad ProfilePage');
		this.GetCountry();
        this.GetCountryName();
	}

	savedata(){
		this.storage.set("whatsapp",this.whatsapp);
		this.storage.set("user_name",this.user_name);
		this.storage.set("address",this.address);
		this.storage.set("home_number",this.home_number);
		this.storage.set("city",this.city);
		this.storage.set("state",this.state);
		this.storage.set("street",this.street);
		let toast = this.toastCtrl.create({
	        message: 'تم تعديل البيانات بنجاح',
	        duration: 3000
      	});
      	this.app.getRootNav().setRoot(MainPage);
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

}
