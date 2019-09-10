import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BackendService } from './../../services/backend.service';
import{LanguageService} from './../../services/language.service';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {

  cartMembers: any[];
  cartKeys: string[] = [];
  error: boolean = false;
  errorMessage: string = "";
  dataLoading: boolean = false;
  private querySubscription;

  constructor(private _backendService: BackendService,public _language: LanguageService) {
    this.getOrders();
  }
  ngOnInit() { 
 
  }

  //Funkcija koja ucitava sve podatke iz date kolekcije
  getOrders() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getUserOrders(this._backendService.userId()).subscribe(members => {
      this.cartMembers = members;
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
}
