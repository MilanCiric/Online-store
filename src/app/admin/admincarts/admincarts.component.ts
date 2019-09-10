import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BackendService } from './../../services/backend.service';
import { LanguageService } from './../../services/language.service';

@Component({
  selector: 'admincarts',
  templateUrl: './admincarts.component.html',
  styleUrls: ['./admincarts.component.css']
})
export class AdmincartsComponent implements OnInit {

  cartMembers: any[];
  shoppingCart: any;
  cartKeys: string[] = [];
  cartKeysTotals: string[] = [];
  tempCartMembers: any[];
  error: boolean = false;
  errorMessage: string = "";
  dataLoading: boolean = false;
  private querySubscription;
  administrativeData: any;

  constructor(private _backendService: BackendService, public _language: LanguageService) { }

  ngOnInit() {
    this.getCarts();
    this.isLanguageChanged();
  }

  //-----------------------------------------------------------------------------------------------------------

  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged() {
    return this._language.isLanguageChanged().subscribe(data => { });
  }

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

  //Funkcija koja ucitava sve podatke iz date kolekcije
  getCarts() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getAllCarts().subscribe(members => {
      this.cartKeys = [];
      this.cartMembers = members;
      let temp = [];
      let temp2 = [];
      for (let el of this.cartMembers) {
        temp[el._id] = el;
        temp2[el._id] = 0;
        for (let el2 of el.listOfProducts)
          temp2[el._id] += el2.total;
        this.cartKeys.push(el._id);
      }
      this.cartKeysTotals = temp2;
      this.cartMembers = temp;
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

  //Funkcija koja uklanja jedan elemenat iz korpe
  deleteFromCart(cartId, itemId) {
    this.shoppingCart = this.cartMembers[cartId];
    let index = this.shoppingCart.listOfProducts.findIndex(x => x.id === itemId);
    console.log(this.shoppingCart.listOfProducts.find(x => x.id === itemId));
    this.shoppingCart.listOfProducts.splice(index, 1);
    let total = 0;
    for (let el of this.shoppingCart.listOfProducts)
      total += Number(el.count) * (Number(el.price) - (Number(el.price) / Number(100) * Number(el.discount)) + Number(el.shipping));
    this.shoppingCart.grandTotal = total + total * this.administrativeData.pdv;
    this.cartKeysTotals[cartId] = String(total);
  }

  //Funkcija koja upisuje korpu u bazu ili je modifikuje ako je vec u bazi
  //moze postojati samo jedna aktivna korpa za jednog korisnika, jer kad se kupovina zavrssena sadrzaj korpe ide u orders sekciju
  updateCart(cartId, username) {
    this.dataLoading = true;
    console.log(this.shoppingCart);
    this.querySubscription = this._backendService.updateShoppingCart('carts', this.shoppingCart, 1, cartId, this.shoppingCart.grandTotal, username).then(res => {
      this.dataLoading = false;
    }
    ).catch(error => {
      this.error = true;
      console.log(error.message);
      this.errorMessage = error.message;
      this.dataLoading = false;
    });

  }

  //Funkcija za uklanjanje korpe iz baze
  deleteCart(cartId) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.deleteShoppingCart(cartId).then(res => {
      this.dataLoading = false;
    }
    ).catch(error => {
      this.error = true;
      console.log(error.message);
      this.errorMessage = error.message;
      this.dataLoading = false;
    });
  }

  //-----------------------------------------------------------------------------------------------------------


}
