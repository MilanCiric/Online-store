import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { BackendService } from './../../services/backend.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { LanguageService } from './../../services/language.service';

@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class CategoryComponent implements OnInit {

  tiles: any[];
  tiles2: any[];
  error: boolean = false;
  errorMessage: string = "";
  dataLoading: boolean = false;
  private querySubscription;

  constructor(private _backendService: BackendService, private _storage: AngularFireStorage, private cdr: ChangeDetectorRef, public _language: LanguageService) { }

  ngOnInit() {
    this.getCategory();
    this.getManufacturer();
    this.isLanguageChanged();
  }

  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged() {
    return this._language.isLanguageChanged().subscribe(data => { });
  }
  //-----------------------------------------------------------------------------------------------------------
  //funkcije za komunikaciju sa bazom--------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------


  //Funkcija za upis podataka u bazu
  setData(coll, formData) {
    formData = this.toLowerCase(formData);
    this.dataLoading = true;
    this.querySubscription = this._backendService.setCategoryAndManufacturer(coll, formData).then((res) => {
      this.dataLoading = false;
    }).catch(error => {
      this.error = true;
      console.log(error.message);
      this.errorMessage = error.message;
      this.dataLoading = false;
    });
  }

  //Funkcija koja ucitava listu kategorija iz baze
  getCategory() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getCategoryAndManufacturer('category').subscribe(res => {
      this.tiles = res;
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

  //Funkcija koja ucitava listu proizvodjaca iz baze
  getManufacturer() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getCategoryAndManufacturer('manufacturer').subscribe(res => {
      this.tiles2 = res;
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

  //Funkcija za brisanje jednog dokumenta, podatka
  delete(coll, docId) {
    if (confirm("Are you sure want to delete this record?")) {
      this.dataLoading = true;
      this.querySubscription = this._backendService.delOneCategory(coll, docId)
        .then((res) => {
          this.dataLoading = false;
        }
        ).catch(error => {
          this.error = true;
          console.log(error.message);
          this.errorMessage = error.message;
          this.dataLoading = false;
        });
    }
  }

  //Funkcija za promenu imena kategorije
  rename(coll, catId, catName) {
    let rename = prompt('You want to change category ' + catName + ' to:');
    if (rename) {
      this.dataLoading = true;
      this.querySubscription = this._backendService.renameCategory(coll, catId, rename).then(res => {
        this.dataLoading = false;
      }
      ).catch(error => {
        this.error = true;
        console.log(error.message);
        this.errorMessage = error.message;
        this.dataLoading = false;
      });
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  //Funkcije za prevodjenje slova------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------

  //Funkcija za prevodjenje u mala slova
  toLowerCase(formData) {
    let key = Object.keys(formData);
    let n = key.length;
    while (n--) {
      formData[key[n]] = formData[key[n]].toLowerCase();
    }
    return formData;
  }
  //-----------------------------------------------------------------------------------------------------------
  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
