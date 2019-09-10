import { Component, OnInit, Input } from '@angular/core';
import { BackendService } from './../../services/backend.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { LanguageService } from './../../services/language.service';


//interfejs koji se koristi za korisnika
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
  displayName: string,
  suspended: boolean,
  isadmin: boolean,
  language: string
}

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  profileUrl: Observable<string | null>;
  changePic: boolean = false;
  private _jsonURL = 'assets/Language/lang-EN.json';
  curentUser: user;
  tempUser: any;
  temp: any;
  userLoggedin: boolean = true;
  dataLoading: boolean = false;
  savedChanges = false;
  error: boolean = false;
  errorMessage: string = "";
  private querySubscription;

  constructor(private _backendService: BackendService, public afAuth: AngularFireAuth, private _storage: AngularFireStorage, public _language: LanguageService) {
  }

  ngOnInit() {
    this.curentUser = {} as user;
    this.checkUserExistance();
    this.getUser();
    this.getUserInfo();
    this.getPic(this.getID());
    this.isLanguageChanged();
  }
  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged(){
    return this._language.isLanguageChanged().subscribe(data=>{});
  }

  //Funkcija koja proverava da li postoji korisnik u bazi, i ako ne kreira mu osnovne podatke
  checkUserExistance() {
    let userId = this._backendService.userId();
    let userInfo = this._backendService.getUserInfo(userId).subscribe(data => {
      this.tempUser = data;
      if (this.tempUser.length == 0) {
        let data: any = this._backendService.getUserCredentials();
        this.tempUser.mail = data.email;
        this.tempUser.photoURL = data.photoURL;
        this.tempUser.accessMethod = data.providerData[0].providerId;
        this.tempUser.displayName = data.displayName;
        this.tempUser._id = data.uid;
        this.tempUser.isadmin = false;
        this.tempUser.language = "EN";
        this.tempUser.suspended = false;
        this._backendService.setUser(this.tempUser).catch(error => {
          console.log(error.message);
        });
      }
    });
  }

  //Funkcija za pribavljanje slike
  getPic(userId) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getUserInfo(this.curentUser._id).subscribe(data => {
      this.temp = data[0];
      this.dataLoading = false;
      const ref = this._storage.ref(this.temp.photoURL);
      this.profileUrl = ref.getDownloadURL();
    },
      (error) => {
        this.error = true;
        console.log(error.message);
        this.errorMessage = error.message;
        this.dataLoading = false;
      },
      () => {
        this.error = false;
        this.dataLoading = false;
      });
  }

  //Pribavlja korisnicke informacij od strane autentifikacione strane firebase
  getUser() {
    let data = this._backendService.getUserCredentials()
    this.curentUser.mail = data.email;
    this.curentUser.photoURL = data.photoURL;
    this.curentUser.displayName = data.displayName;
    this.curentUser._id = data.uid;
  }

  //Pribavlja informacije o korisniku smestene u bazi
  getUserInfo() {
    this.dataLoading = true;
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
        displayName: this.temp.displayName,
        isadmin: this.temp.isadmin,
        suspended: this.temp.suspended,
        language: this.temp.language
      }
      this.dataLoading = false;
    },
      (error) => {
        this.error = true;
        console.log(error.message);
        this.errorMessage = error.message;
        this.dataLoading = false;
      },
      () => {
        this.error = false;
        this.dataLoading = false;
      });
  }

  //Funkcija koja vraca id
  getID() {
    return this._backendService.userId();
  }

  //Osvezava korisnicke informacije u bazi
  updateUserInfo(formData) {
    this.curentUser.name = formData.name;
    this.curentUser.midname = formData.midname;
    this.curentUser.surname = formData.surname;
    this.curentUser.country = formData.country;
    this.curentUser.state = formData.state;
    this.curentUser.city = formData.city
    this.curentUser.zipcode = formData.zipcode;
    this.curentUser.tel = formData.tel;
    this.curentUser.displayName = formData.name + ' ' + formData.surname;
    this.curentUser.language = formData.language;
    this.dataLoading = true;
    this.querySubscription = this._backendService.updateUser(this.curentUser).then((res) => {
      this.savedChanges = true;
      this.dataLoading = false;
    }).catch(error => {
      this.error = true;
      console.log(error.message);
      this.errorMessage = error.message;
      this.dataLoading = false;
    });
  }
}
