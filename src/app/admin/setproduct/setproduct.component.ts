import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from './../../services/backend.service';
import { Observable } from 'rxjs/Rx';
import { AngularFireStorage } from '@angular/fire/storage';
import { LanguageService } from './../../services/language.service';

export interface man {
  value: string;
  name: string;
}

@Component({
  selector: 'setproduct',
  templateUrl: './setproduct.component.html',
  styleUrls: ['./setproduct.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SetproductComponent implements OnInit, OnDestroy {

  toggleField: string;
  showResults: boolean = false;
  selectedManufacturer: string;
  selectedCategory: string;
  searchCategory: any[];
  SearchManufacturer: any[];
  members: Array<Object> = [];
  myDocData: any;
  savedChanges = false;
  error: boolean = false;
  errorMessage: string = "";
  dataLoading: boolean = false;
  private querySubscription;
  oneDataDescription;
  profileUrl: Observable<string | null>;
  takeHostSelfie = false;
  showHostSelfie = false;
  myDocId;
  displayedColumns: string[] = ['category', 'scategory', 'lname', 'price', 'stock','discount', '_id'];
  dataSource: MatTableDataSource<any>;
  dataSourceSearch: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginatorSearch: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSort, { static: true }) sortSearch: MatSort;


  constructor(private _backendService: BackendService, private _storage: AngularFireStorage, private cdr: ChangeDetectorRef, public _language: LanguageService) {
    this.getData();
  }

  ngOnInit() {
    this.toggleField = "searchMode";
    this.getCategory();
    this.getManufacturer();
    this.isLanguageChanged();
  }

  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged() {
    return this._language.isLanguageChanged().subscribe(data => { });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSourceSearch.paginator = this.paginatorSearch;
    this.dataSourceSearch.sort = this.sortSearch;
  }

  //funkcija koja nam menja poglede u zavisnosti od vrednosti filtera
  toggle(filter?) {
    if (!filter) {
      filter = "searchMode";
    }
    else { filter = filter; }
    this.toggleField = filter;
  }

  //-----------------------------------------------------------------------------------------------------------
  //funkcije za komunikaciju sa bazom--------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------

  //Funkcija koja ucitava sve podatke iz date kolekcije
  getData() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getDocs('product').subscribe(members => {
      this.members = members;
      this.dataSource = new MatTableDataSource(members);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
  //funkcija za ucitavanje kategorija
  getCategory() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getCategoryAndManufacturer('category').subscribe(res => {
      this.searchCategory = res;
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

  //funkcija za ucitavnje proizvodjaca
  getManufacturer() {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getCategoryAndManufacturer('manufacturer').subscribe(res => {
      this.SearchManufacturer = res;
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

  //Funkcija za upis podataka u bazu
  setData(formData) {
    formData = this.toLowerCase(formData);
    this.dataLoading = true;
    this.querySubscription = this._backendService.setDocs('product', formData).then((res) => {
      this.savedChanges = true;
      this.dataLoading = false;
    }).catch(error => {
      this.error = true;
      console.log(error.message);
      this.errorMessage = error.message;
      this.dataLoading = false;
    });
  }
  //Funkcija preko koje se vrsi pretraga iz baze
  getFilterData(filters) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getFilterDocs('product', filters).subscribe(members => {
      this.members = members;
      this.dataSourceSearch = new MatTableDataSource(members);
      this.dataSourceSearch.paginator = this.paginatorSearch;
      this.dataSourceSearch.sort = this.sortSearch;
      this.dataLoading = false;
    },
      (error) => {
        console.log(error.message);
        this.error = true;
        this.errorMessage = error.message;
        this.dataLoading = false;
      },
      () => {
        this.error = false;
        this.dataLoading = false;
      });
  }
  //Funkcija koja osvezava podatke, odnosno ako ima izmena upisuje izmene
  updateData(formData) {
    formData = this.toLowerCase(formData);
    this.dataLoading = true;
    this.querySubscription = this._backendService.updateDocs('product', formData).then(res => {
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

  //Funkcija koja pribavlja jedan dokumenat, zapis
  getDoc(docId) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getOneDoc('product', docId).subscribe(res => {
      if (res) {
        this.myDocData = res;
        this.oneDataDescription = res;
        this.dataLoading = false;
      }
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

  //Funkcija za meko brisanje jednog dokumenta, podatka
  deleteDoc(docId) {
    if (confirm("Are you sure want to delete this record?")) {
      this.dataLoading = true;
      this.querySubscription = this._backendService.softDelOneDoc('product', docId)
        .then((res) => {
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
  }

  //Funkcija za trajno brisanje jednog dokumenta, podatka
  deleteForeverDoc(docId) {
    if (confirm("Are you sure want to delete this record?")) {
      this.dataLoading = true;
      this.querySubscription = this._backendService.deleteDoc('product', docId)
        .then((res) => {
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
  }

  //-----------------------------------------------------------------------------------------------------------
  //Funkcije za rad sa slikama---------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------

  //Funkcija za pribavljanje slike
  getPic(picId) {
    const ref = this._storage.ref(picId);
    this.profileUrl = ref.getDownloadURL();
  }
  //Funkcija za brisanje slike
  deletePic(docId) {
    if (confirm("Are you sure want to delete this picture ?")) {
      this._backendService.deletePic('product', docId);
    }
  }

  //-----------------------------------------------------------------------------------------------------------
  //Funkcije za rad sa prikazom podataka u tabeli--------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  //Funkcija za primenu filtera nad tabelarnim podacima
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //-----------------------------------------------------------------------------------------------------------
  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
  //-----------------------------------------------------------------------------------------------------------
  //Funkcije za prevodjenje slova------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  //Funkcija za prevodjenje u mala slova
  toLowerCase(formData) {
    let key = Object.keys(formData);
    let n = key.length;
    while (n--) {

      if (key[n] != '_id' && key[n] != 'lname' && key[n] != 'descr' && key[n] != 'shipping'
      && key[n] != 'size' && key[n] != 'discount' && key[n] != 'stock') {
        formData[key[n]] = formData[key[n]].toLowerCase();
      }

    }
    return formData;
  }
}
