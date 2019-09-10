import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BackendService } from './../../services/backend.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { LanguageService } from './../../services/language.service';


@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle: string;
  @Input() iconTitle: string;
  @Input() helpTitle: string;

  adminAccess: boolean = false;
  private querySubscription;
  ConfigData;
  temp: any;
  counter: number = 0;
  error: boolean = false;
  errorMessage: string;
  userColor: string = 'warn';
  header;

  constructor(private _backendService: BackendService, public afAuth: AngularFireAuth, public _language: LanguageService) {
  }

  ngOnInit() {
    this.ConfigData = this._backendService.getConfig();
    this.getUserStatusColor();
    this.getUserCartCounts();
    this.isAdmin();
  }

  isAdmin(){
    this._backendService.isUserAdmin().subscribe(data=>{
      this.adminAccess = data.isadmin;
    });
  }
  //Funkcija koja nadgleda promenu statusa korisnika i podesava boju ikona
  getUserStatusColor() {
    this._backendService.isUserLoggedin().subscribe((data) => {
      if (data)
        this.userColor = 'primary';
      else
        this.userColor = 'warn';
    });
  }

  //Funkcija koja menja jezik prikaza
  changeLanguage(lang:string) {
    this.header = this._language.Selectedlang = lang;
    this._language.isLanguageChanged().subscribe((data) => {
      if (data)
        this.header = this._language.langData[this._language.Selectedlang].footer;
    });
  }

  //Funkcija koja nadgleda promenu statusa korisnika i podesava broj proizvoda u korpi
  getUserCartCounts() {
    this._backendService.isUserLoggedin().subscribe((data) => {
      if (data) {
        this.getCart();
      }
      else {
        this.counter = 0;
      }
    });
  }

  //Funkcija koja pribavlja korpu iz baze
  getCart() {
    this.querySubscription = this._backendService.Search('carts', this._backendService.userId()).subscribe(members => {
      this.temp = members;
      this.counter = this.temp[0].listOfProducts.length;
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
