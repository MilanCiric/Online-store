import { Component, OnInit, Inject } from '@angular/core';
import { BackendService } from './../../services/backend.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { LanguageService } from './../../services/language.service';

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
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

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
    this.GetUserInfo();
    this.getCart();
    this.getAdministratives();
  }

  ngOnInit() {
    this.shoppingCart = new Array<product>();
    this.existsInCarts();
    this.isLanguageChanged();
  }
  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged() {
    return this._language.isLanguageChanged().subscribe(data => { });
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
  //Funkcija koja pribavlja informacije o korisniku
  GetUserInfo() {
    this.querySubscription = this._backendService.getOneDoc('users', this._backendService.userId()).subscribe(user => {
      this.user = user;
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

  //Funkcija za pretragu po imenu proizvoda
  getFilterData(filters) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.Search('product', filters.toLowerCase()).subscribe(members => {
      this.searchedMembers = members;
      this.getPictures(this.searchedMembers);
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

  //Funkcija koja prikazuje detalje o proizvodu i hvata podatke od interesa
  showDetails(item) {
    this.counter = 0;
    this.myDocData = item;
    this.myDocData.total = Number(item.price) - (Number(item.price) / Number(100) * Number(item.discount)) + Number(item.shipping);
    this.getPic(item.path);
    //deo koda koji hvata podatke od interesa vezano sta je korisnik pregledao
    //jako korisna informacija ako se kasnije formira interesna grupa oglasa ili reklama i sl.
    this.dataLoading = true;
    this.querySubscription = this._backendService.updateShoppingInterest(item).then((res) => {
      this.dataLoading = false;
    }).catch(error => {
      this.error = true;
      console.log(error.message);
      this.errorMessage = error.message;
      this.dataLoading = false;
    });
  }

  //Funkcija koja belezi koliko proizvoda korisnik zeli da doda u korpu
  countProd(filter) {
    if (filter == "add") {
      this.counter++;
    }
    else {
      if (this.counter > 0) {
        this.counter--;
      }
    }
  }

  //Funkcija za ponistavanje rezultata pretrage
  clearSearchResults() {
    this.searchedMembers = null;
  }

  //Funkcija koja dodaje proiyvod u korpu
  addToCart(item, counter) {
    this.dataLoading = true;
    let data = item;
    data.quantity = counter;
    this.dataLoading = true;
    let price = Number(this.counter) * (Number(item.price) - (Number(item.price) / Number(100) * Number(item.discount)) + Number(item.shipping));
    //uzimanje iz item objekta samo ono sto nam je potrebno za korpu, ostali opisi nam ne trebaju
    let obj: product = {
      id: item.id,
      discount: item.discount,
      lname: item.lname,
      price: item.price,
      shipping: item.shipping,
      count: this.counter,
      total: price
    };
    this.shoppingCart.push(obj);
    this.total += (Number(obj.total));
  }

  //Funkcija koja proverava da li postoji korpa u bazi za datog korisnika koja nije procesirana 
  existsInCarts() {
    this.querySubscription = this._backendService.isInTheCarts(this._backendService.userId()).subscribe(res => {
      if (res.length != 0) {
        this.exists = true;
        this.cartMembers = res;
        this.cartId = this.cartMembers[0]._id;
      }
      else {
        this.exists = false;
      }
    });
  }

  //Funkcija koja upisuje korpu u bazu ili je modifikuje ako je vec u bazi
  //moze postojati samo jedna aktivna korpa za jednog korisnika, jer kad se kupovina zavrssena sadrzaj korpe ide u orders sekciju
  updateCart() {
    this.existsInCarts();
    if (this.exists) {
      this.dataLoading = true;
      this.querySubscription = this._backendService.updateShoppingCart('carts', this.shoppingCart, 0, this.cartId, this.total + this.total * this.administrativeData.pdv, this.user.displayName).then(res => {
        this.savedChanges = true;
        this.dataLoading = false;
      }
      ).catch(error => {
        this.error = true;
        console.log(error.message);
        this.errorMessage = error.message;
        this.dataLoading = false;
      });
    }
    else {
      this.dataLoading = true;
      this.querySubscription = this._backendService.setShoppingCart('carts', this.shoppingCart, this.total + this.total * this.administrativeData.pdv, this.user.displayName).then((res) => {
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

  //Funkcija koja pribavlja korpu iz baze
  getCart() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.Search('carts', this._backendService.userId()).subscribe(members => {
      this.cartMembers = members;
      this.shoppingCart = this.cartMembers[0].listOfProducts;
      this.dataLoading = false;
      for (let el of this.shoppingCart)
        this.total += Number(el.count) * (Number(el.price) - (Number(el.price) / Number(100) * Number(el.discount)) + Number(el.shipping));
    },
      (error) => {
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
      },
      () => {
        this.error = false;
        this.dataLoading = false;
      });
  }

  //Funkcija koja uklanja jedan elemenat iz korpe
  deleteFromCart(itemId) {
    let index = this.shoppingCart.findIndex(x => x.id === itemId);
    console.log(this.shoppingCart.find(x => x.id === itemId));
    this.shoppingCart.splice(index, 1)
    this.total = 0;
    for (let el of this.shoppingCart)
      this.total += Number(el.count) * (Number(el.price) - (Number(el.price) / Number(100) * Number(el.discount)) + Number(el.shipping));
  }
}
