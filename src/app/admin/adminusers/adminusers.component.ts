import { Component, OnInit } from '@angular/core';
import { BackendService } from './../../services/backend.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { LanguageService } from './../../services/language.service';

@Component({
  selector: 'adminusers',
  templateUrl: './adminusers.component.html',
  styleUrls: ['./adminusers.component.css']
})
export class AdminusersComponent implements OnInit {

  temp: any;
  error: boolean = false;
  savedChanges: boolean = false;
  errorMessage: string = "";
  dataLoading: boolean = false;
  private querySubscription;
  users: any = [];
  profileUrl: Observable<string | null>;

  constructor(private _backendService: BackendService, private _storage: AngularFireStorage, public _language: LanguageService) { }

  ngOnInit() {
    this.getUsers();
    this.isLanguageChanged();
  }

  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged() {
    return this._language.isLanguageChanged().subscribe(data => { });
  }

  //Funkcija koja pribavlja informacije o korisnicima
  getUsers() {
    this.querySubscription = this._backendService.getAllUsers().subscribe(users => {
      this.users = users;
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

  //Funkcija koja suspenduje korisnika
  suspendUser(userId) {
    if (confirm("Are you sure want to suspend this user?")) {
      this.dataLoading = true;
      this.querySubscription = this._backendService.suspendUser(userId)
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

  //Funkcija koja unapredjuje korisnika u administratora
  promoteToAdmin(userId) {
    if (confirm("Are you sure want to declare this useras admin?")) {
      this.dataLoading = true;
      this.querySubscription = this._backendService.makeAdmin(userId)
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

  //Funkcija koja unazadjuje administratora u korisnika
  demoteToAdmin(userId) {
    if (confirm("Are you sure want to declare this useras admin?")) {
      this.dataLoading = true;
      this.querySubscription = this._backendService.demoteAdmin(userId)
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

  //Funkcija kojom se ponovo aktivira korisnik
  activateUser(userId) {
    if (confirm("Are you sure want to reactivate this user?")) {
      this.dataLoading = true;
      this.querySubscription = this._backendService.activateUser(userId)
        .then((res) => {
          this.savedChanges = true;
          this.dataLoading = false;
        }
        ).catch(error => {
          this.error = true;
          this.errorMessage = error.message;
          this.dataLoading = false;
        });
    }
  }
  getPic(userId) {
    this.dataLoading = true;
    this.querySubscription = this._backendService.getUserInfo(userId).subscribe(data => {
      this.temp = data[0];
      this.dataLoading = false;
      const ref = this._storage.ref(this.temp.photoURL);
      this.profileUrl = ref.getDownloadURL();
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
