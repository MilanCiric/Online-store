import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { SubscribeOnObservable } from 'rxjs/internal-compatibility';
import { BackendService } from 'src/app/services/backend.service';
import { LanguageService } from './../../../services/language.service';



//Interfejs koji koristimo za prikupljanje podataka o proizvodu
export interface product {
  lname: string,
  price: number,
  id: string,
  shipping: number,
  discount: number,
  count: number,
  total: number
}

//Posto je putanja slike tipa Observable mora ovako pa onda od nje da se pravi asocijativni niz
export interface pictures {
  path: Observable<string | null>
}

@Component({
  selector: 'browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {

  user: any;
  toggle: boolean = true;
  savedChanges = false;
  error: boolean = false;
  errorMessage: String = "";
  dataLoading: boolean = false;
  private querySubscription;
  cart: boolean = false;
  total: number = 0;
  cartMembers;
  searchedMembers;
  exists: boolean = false;
  cartId: string = "";
  ext: boolean = false;
  counter = 0;
  myDocData;
  myDocId;
  suspended: boolean = false;
  shoppingCart: Array<product>;
  photoURL: Observable<string | null>;
  searchPhotoesURL: pictures[] = [];
  administrativeData: any;

  constructor(private _backendService: BackendService, private _storage: AngularFireStorage, public _language: LanguageService) {

  }

  ngOnInit() {
    this.isLanguageChanged();
  }

  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged() {
    return this._language.isLanguageChanged().subscribe(data => { });
  }
  //Funkcija za pretragu po imenu proizvoda
  getFilterData(filters) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.Search('product', filters.toLowerCase()).subscribe(members => {
      this.searchedMembers = members;
      this.dataLoading = false;
      this.getPictures(this.searchedMembers);
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

  //Funkcija koja prikazuje detalje o proizvodu i hvata podatke od interesa
  showDetails(item) {
    this.myDocData = item;
    this.myDocData.total = Number(item.price) - (Number(item.price) / Number(100) * Number(item.discount)) + Number(item.shipping);
    this.getPic(item.path);
  }

  //Funkcija za ponistavanje rezultata pretrage
  clearSearchResults() {
    this.searchedMembers = null;
  }
  
  //Funkcija za pribavljanje administrativnih vrednosti
  getAdministratives() {
    this.querySubscription = this._backendService.getAdministratives('administrative').subscribe((data) => {
      this.administrativeData = data[0];
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
  //Funkcija za pribavljanje slike
  getPic(picId) {
    const ref = this._storage.ref(picId);
    this.photoURL = ref.getDownloadURL();
  }

  //Funkcija koja pribavlja slike vezane za rezultate pretrage
  getPictures(filteredData) {
    for (let el of filteredData) {
      const ref = this._storage.ref(el.path);
      this.searchPhotoesURL[el.id] = Object();
      this.searchPhotoesURL[el.id].path = ref.getDownloadURL();
    }
  }


}
