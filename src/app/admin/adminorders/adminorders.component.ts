import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BackendService } from './../../services/backend.service';
import { LanguageService } from './../../services/language.service';

@Component({
  selector: 'adminorders',
  templateUrl: './adminorders.component.html',
  styleUrls: ['./adminorders.component.css']
})
export class AdminordersComponent implements OnInit {

  cartMembers: any[];
  shoppingCart: any;
  cartKeys: string[] = [];
  error: boolean = false;
  errorMessage: string = "";
  dataLoading: boolean = false;
  private querySubscription;
  administrativeData: any;

  constructor(private _backendService: BackendService, public _language: LanguageService) {
    this.getAdministratives();
  }

  ngOnInit() {
    this.getOrders();
    this.isLanguageChanged();
  }

  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged() {
    return this._language.isLanguageChanged().subscribe(data => { });
  }

  //Funkcija za učitavanje administrativnih podataka
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
  getOrders() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getAllOrders().subscribe(members => {
      this.cartKeys = [];
      this.cartMembers = members;
      let temp = [];
      for (let el of this.cartMembers) {
        temp[el._id] = el;
        this.cartKeys.push(el._id);
      }
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
  deleteFromOrder(cartId, itemId) {
    this.shoppingCart = this.cartMembers[cartId];
    this.shoppingCart.listOfProducts.splice(this.shoppingCart.listOfProducts.indexOf(itemId), 1);
    let total = 0;
    for (let el of this.shoppingCart.listOfProducts)
      total += Number(el.count) * (Number(el.price) - (Number(el.price) / Number(100) * Number(el.discount)) + Number(el.shipping));
    this.shoppingCart.grandTotal = total;
  }



  //Funkcija koja brise porudzbenicu
  deleteOrder(cartId) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.deleteOrder(cartId).then(res => {
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
  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

}
