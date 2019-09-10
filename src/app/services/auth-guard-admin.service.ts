import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { BackendService } from './backend.service';
import {take, map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdminService implements CanActivate {

  constructor(private _backendService: BackendService) { }

  //Funkcija koja vraca tacno ili netacno u zavisnosti da li je korisnik administrator ili ne
  canActivate(): Observable<boolean>{
    return this._backendService.isUserAdmin()
    .take(1)
    .map(res =>{
      if(res){
        return res.isadmin;
      }
      else{
        return false;
      }
    })
    .do(isadmin=>{
      console.log(isadmin);
      return true;
    });
  }
}
