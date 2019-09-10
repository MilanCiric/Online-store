import { Component, OnInit } from '@angular/core';
import { LanguageService } from './../../services/language.service';
import { BackendService } from './../../services/backend.service';

@Component({
  selector: 'administratives',
  templateUrl: './administratives.component.html',
  styleUrls: ['./administratives.component.css']
})
export class AdministrativesComponent implements OnInit {


  category: any[];
  manufacturer: any[];
  error: boolean = false;
  errorMessage: string = "";
  dataLoading: boolean = false;
  private querySubscription;
  administrativeData: any;
  discountManufacturer: 0;
  discountCategory: 0;
  discountsCategory: {} = {};
  discountsManufacturer: {} = {};
  data: any;
  productData = [];
  temp: any;
  categoryKeys: any;
  manufacturerKeys: any;


  constructor(public _language: LanguageService, private _backendService: BackendService) {
    this.getDocs();
  }

  ngOnInit() {

    this.isLanguageChanged();
    this.getAdministratives();
    this.getCategory();
    this.getManufacturer();
    this.getDiscounts();
  }
  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged() {
    return this._language.isLanguageChanged().subscribe(data => { });
  }

  //Funkcija za pribavljanje id-eva proizvoda
  getDocs() {
    this.querySubscription = this._backendService.getDocs('product').subscribe(res => {
      this.temp = res;
      for (let el of res) {
        let item = {
          _id: el._id,
          scategory: el.scategory,
          category: el.category
        }
        this.productData.push(item);
      }
    });
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

  //Funkcija koja ucitava listu kategorija iz baze
  getCategory() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getCategoryAndManufacturer('category').subscribe(res => {
      this.category = res;

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

  getKeys(array, data) {
    let temp = [];
    for (let el of data) {
      if (array[el.name] != null)
        temp.push(el.name);
    }
    return temp;
  }
  //Funkcija koja ucitava listu proizvodjaca iz baze
  getManufacturer() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getCategoryAndManufacturer('manufacturer').subscribe(res => {
      this.manufacturer = res;
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

  //Funkcija koja menja administrativne podatke u bazi
  setAdministrative(coll, formData) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.setAdministratives(coll, formData).then((res) => {
      this.dataLoading = false;
    }).catch(error => {
      this.error = true;
      console.log(error.message);
      this.errorMessage = error.message;
      this.dataLoading = false;
    });
  }

  //Funkcija koja postavlja popust
  setDiscount(coll, data, type) {
    this.dataLoading = true;
    if (type == "category") {
      this.discountsCategory[data.selectedCategory] = data.discountCategory;
      this.querySubscription = this._backendService.setDiscount(coll, this.discountsCategory, type).then((res) => {
        this.dataLoading = false;
      }).catch(error => {
        this.error = true;
        console.log(error.message);
        this.errorMessage = error.message;
        this.dataLoading = false;
      });
      this.setDiscountProducts('category', data.discountCategory, data.selectedCategory);
    }
    else {
      this.discountsManufacturer[data.selectedManufacturer] = data.discountManufacturer;
      this.querySubscription = this._backendService.setDiscount(coll, this.discountsManufacturer, type).then((res) => {
        this.dataLoading = false;

        console.log(this.data);
      }).catch(error => {
        this.error = true;
        console.log(error.message);
        this.errorMessage = error.message;
        this.dataLoading = false;
      });

      this.setDiscountProducts('scategory', data.discountManufacturer, data.selectedManufacturer);
    }

  }

  //Funkcija koja postavlja popuste proizvodima u zavisnosti od kriterijuma
  setDiscountProducts(type, discount, type2) {

    //ovde promeniti iteraciju
    if (type == "category") {
      for (let el of this.productData) {
        if (el.category == type2) {
          let el2 = {
            discount: discount,
            _id: el._id
          };
          this.querySubscription = this._backendService.setDiscountsProducts(el2).then(res => {
          })
        }
      }
    } else {
      for (let el of this.productData) {
        if (el.scategory == type2) {
          let el2 = {
            discount: discount,
            _id: el._id
          };
          this.querySubscription = this._backendService.setDiscountsProducts(el2).then(res => {
          })
        }
      }
    }
  }

  //Funkcija koja pribavlja postojeće popuste
  getDiscounts() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getDiscounts().subscribe(res => {
      this.discountsCategory = res[0].array;
      this.discountsManufacturer = res[1].array;
      this.categoryKeys = this.getKeys(this.discountsCategory, this.category);
      this.manufacturerKeys = this.getKeys(this.discountsManufacturer, this.manufacturer);
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

  deleteDiscount(el, type) {
    if (confirm(this._language.langDataFinal.administratives.deleteDisc+el)) {
      if (type == 'category') {
        delete this.discountsCategory[el];
        this.categoryKeys.splice(this.categoryKeys.indexOf(el), 1);
        this.querySubscription = this._backendService.setDiscount('discounts', this.discountsCategory, 'category').then((res) => {
          this.dataLoading = false;

        }).catch(error => {
          this.error = true;
          console.log(error.message);
          this.errorMessage = error.message;
          this.dataLoading = false;
        });

        this.setDiscountProducts('category', 0, el);
      }
      else {
        delete this.discountsManufacturer[el];
        this.manufacturerKeys.splice(this.manufacturerKeys.indexOf(el), 1);
        this.querySubscription = this._backendService.setDiscount('discounts', this.discountsManufacturer, 'manufacturer').then((res) => {
          this.dataLoading = false;
        }).catch(error => {
          this.error = true;
          console.log(error.message);
          this.errorMessage = error.message;
          this.dataLoading = false;
        });
        this.setDiscountProducts('manufacturer', 0, el);
      }
    }
  }
  //-----------------------------------------------------------------------------------------------------------
  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
