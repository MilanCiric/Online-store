import { Component, OnInit, Inject } from '@angular/core';
import { BackendService } from './../../services/backend.service';
import { Observable, from } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import {LanguageService} from './../../services/language.service'; 

//Interfejs koji se koristi za smestanje podataka o proizvodu
export interface product {
  lname: string,
  price: number,
  id: string,
  shipping: number,
  discount: number,
  count: number,
  total: number
}

@Component({
  selector: 'carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css']
})

export class CartsComponent implements OnInit {

  user: any;
  stock: any[] = [];
  stockUnderflow: any;
  savedChanges = false;
  error: boolean = false;
  errorMessage: String = "";
  dataLoading: boolean = false;
  private querySubscription;
  total: number = 0;
  cartMembers;
  temp: any;
  exists: boolean = false;
  cartId: string = "";
  ext: boolean = false;
  counter = 0;
  myDocData;
  myDocId;
  shoppingCart: Array<product>;
  profileUrl: Observable<string | null>;
  administrativeData: any;

  constructor(private _backendService: BackendService, private _storage: AngularFireStorage, public _language:LanguageService) {
    this.GetUserInfo();
    this.getCart();
    this.getAdministratives();
  }

  ngOnInit() {
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

  //Funkcija za pribavljanje informacija o korisniku
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

  //Funkcija za pribavljanje slike
  getPic(picId) {
    const ref = this._storage.ref(picId);
    this.profileUrl = ref.getDownloadURL();
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
      this.total = 0;
      for (let el of this.shoppingCart)
        this.total += Number(el.count) * (Number(el.price) - (Number(el.price) / Number(100) * Number(el.discount)) + Number(el.shipping));
      this.querySubscription = this._backendService.updateShoppingCart('carts', this.shoppingCart, 0, this.cartId, this.total + this.total * this.administrativeData.pdv, this.user.username).then(res => {
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
      this.querySubscription = this._backendService.setShoppingCart('carts', this.shoppingCart, this.total, this.user.displayName).then((res) => {
        this.savedChanges = true;
        this.dataLoading = false;
      }).catch(error => {
        this.error = true;
        console.log(error.message);
        this.errorMessage = error.message;
        this.dataLoading = false;
      });
    }
    this.total = 0;
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
      for (let el of this.shoppingCart)
        this.getStock(el.id);
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
    this.cartMembers[0].grandTotal = this.total + this.total * this.administrativeData.pdv;
  }

  //Funkcija za potvrdjivanje kupovine koja salje sve iz korpe u poruceno
  orderProducts() {
    this.dataLoading = true;
    let can = true;
    for (let el of this.shoppingCart)
      this.getStock(el.id);
    for (let el of this.shoppingCart) {
      if (this.stock[el.id] < el.count) {
        can = false
        this.stockUnderflow = el.lname;
        break;
      }
    }

    for (let el of this.stock)
      console.log(el);
    if (can) {
      for (let el of this.shoppingCart) {
        this.removeFromStock(el.id, el.count);
      }
      this.querySubscription = this._backendService.makeOrder(this.shoppingCart, this.total, this.user.displayName).then((res) => {
        this.savedChanges = true;
        this.dataLoading = false;
      }).catch(error => {
        this.error = true;
        console.log(error.message);
        this.errorMessage = error.message;
        this.dataLoading = false;
      });
      this.deleteCart();
    }
    else alert('Na zalost nema dovoljno zaliha za: ' + this.stockUnderflow);
  }

  //Funkcija koja uklanja sa lagera broj kupljenih artikala
  removeFromStock(itemId, count) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.removeFromStock(itemId, this.stock[itemId] - count).then(res => {
      this.savedChanges = true;
      this.dataLoading = false;
      this.shoppingCart = null;
    }
    ).catch(error => {
      this.error = true;
      console.log(error.message);
      this.errorMessage = error.message;
      this.dataLoading = false;
    });
  }

  //Funkcija koja pribavlja informacije o lageru za dati predmet
  getStock(itemId) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getStock(itemId).subscribe(members => {
      this.temp = members;
      this.stock[itemId] = this.temp[0].stock;
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

  //Funkcija koja uklanja sadrzinu korpe nakon kupovine
  deleteCart() {
    this.existsInCarts();
    if (this.exists) {
      this.dataLoading = true;
      this.querySubscription = this._backendService.deleteShoppingCart(this.cartId).then(res => {
        this.savedChanges = true;
        this.dataLoading = false;
        this.shoppingCart = null;
      }
      ).catch(error => {
        this.error = true;
        console.log(error.message);
        this.errorMessage = error.message;
        this.dataLoading = false;
      });
    }
  }
}
