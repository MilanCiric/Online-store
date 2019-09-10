import { Component, OnInit } from '@angular/core';
import { BackendService } from './../../services/backend.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { IImage } from '../../../../node_modules/ng-simple-slideshow/src/app/modules/slideshow/IImage';
import {LanguageService} from './../../services/language.service';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  brokenNetwork = false;
  userLoggedin: boolean = false;
  error: boolean = false;
  errorMessage: String = "";
  dataLoading: boolean = false;
  singUpForm: boolean = false;
  iconColor: string = 'warn';

  //--------------------------------------------------------------------------------------------------------
  //komponente vezane za slideshow--------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------
  imageUrls: (string | IImage)[] = [
    { url: '../../../assets/pictures/laptops.jpg' },
    { url: '../../../assets/pictures/mobiles.jpg' },
    { url: '../../../assets/pictures/cameras.jpg' },
    { url: '../../../assets/pictures/computers.jpg' },
    { url: '../../../assets/pictures/projectors.jpg' },
    { url: '../../../assets/pictures/graphiccards.jpg' },
    { url: '../../../assets/pictures/tablets.jpg' }
  ];
  height: string = '550px';
  minHeight: string;
  arrowSize: string = '30px';
  showArrows: boolean = true;
  disableSwiping: boolean = false;
  autoPlay: boolean = true;
  autoPlayInterval: number = 5000;
  stopAutoPlayOnSlide: boolean = true;
  debug: boolean = false;
  backgroundSize: string = 'cover';
  backgroundPosition: string = 'center center';
  backgroundRepeat: string = 'no-repeat';
  showDots: boolean = true;
  dotColor: string = '#FFF';
  showCaptions: boolean = true;
  captionColor: string = '#FFF';
  captionBackground: string = 'rgba(0, 0, 0, .35)';
  lazyLoad: boolean = false;
  hideOnNoSlides: boolean = false;
  width: string = '100%';
  fullscreen: boolean = false;

  //--------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------

  constructor(private _backendService: BackendService, public afAuth: AngularFireAuth, public _language: LanguageService) { }

  ngOnInit() {
    this.isLanguageChanged();
  }
  
  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged(){
    return this._language.isLanguageChanged().subscribe(data=>{});
  }

  //Funkcija koja nam omogucava logovanje
  login(loginType, formData?) {
    this.dataLoading = true;
    console.log();
    return this._backendService.login(loginType, formData).catch((err) => {
      this.error = true;
      this.errorMessage = err.message;
      console.log(err);
      this.userLoggedin = false;
      this.dataLoading = false;
      }
    );
  }

  //Funkcija koja nam omogucava da se registruje novi korisnik uy pomoc email-a i sifre
  singUp(formData) {
    this.dataLoading = true;
    return this._backendService.singUp(formData).catch((err) => {
      this.error = true;
      this.errorMessage = err.message;
      console.log(err);
      this.userLoggedin = false;
      this.dataLoading = false;
    }
    );
  }

  //Funkcija koja odjavljuje korisnika sa sistema
  logout() {
    this.dataLoading = true;
    return this._backendService.logout().then((success) => {
      this.userLoggedin = false;
      this.dataLoading = false;
      window.location.reload();
    });
  }
}
