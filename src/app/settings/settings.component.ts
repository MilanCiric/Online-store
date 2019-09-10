import { Component, OnInit, Input } from '@angular/core';
import { BackendService } from './../services/backend.service';
import { Observable } from 'rxjs';
import{LanguageService} from './../services/language.service';

//interfejs koji se koristi za cuvanje podataka o korisniku
export interface user {
  name: string,
  midname: string,
  surname: string,
  country: string,
  state: string,
  city: string,
  zipcode: string,
  tel: string,
  mail: string,
  _id: string,
  photoURL: string,
  accessMethod: string,
  displayName: string
}
@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  curentUser: user;
  temp: any;
  error: boolean =  false;
  errorMessage: string;
  private querySubscription;

  @Input() lang: Observable<any>;
  Selectedlang: string = 'EN'
  LangData;
  setings;

  constructor(private _backendService: BackendService, public _language: LanguageService) { 
    this.curentUser = {} as user;
    this.getUser();
    this.getUserInfo();

  }

  ngOnInit() {
    this.isLanguageChanged();
  }
  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged(){
    return this._language.isLanguageChanged().subscribe(data=>{});
  }

  //Funkcija koja pribavlja korisnika iz firebase autentifikacionog dela
  getUser() {
    let data = this._backendService.getUserCredentials()
    this.curentUser.mail = data.email;
    this.curentUser.photoURL = data.photoURL;
    this.curentUser.accessMethod = data.providerData[0].providerId;
    this.curentUser.displayName = data.displayName;
    this.curentUser._id = data.uid;
  }

  //Funkcija koja pribavlja informacije o korisniku iz baze
  getUserInfo() {
    this.querySubscription = this._backendService.getUserInfo(this.curentUser._id).subscribe(data => {
      this.temp = data[0];
      this.curentUser = {
        name: this.temp.name,
        midname: this.temp.midname,
        surname: this.temp.surname,
        country: this.temp.country,
        state: this.temp.state,
        city: this.temp.city,
        zipcode: this.temp.zipcode,
        tel: this.temp.tel,
        mail: this.temp.mail,
        _id: this.temp._id,
        photoURL: this.temp.photoURL,
        accessMethod: this.temp.accessMethod,
        displayName: this.temp.displayName
      }
    },
      (error) => {
        this.error = true;
        console.log(error.message);
        this.errorMessage = error.message;
      },
      () => {
        this.error = false;
      });
  }
}
