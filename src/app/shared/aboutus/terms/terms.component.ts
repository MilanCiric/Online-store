import { Component, OnInit } from '@angular/core';
import { LanguageService } from './../../../services/language.service';


@Component({
  selector: 'terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  constructor(public _language: LanguageService) { }

  ngOnInit() {
    this.isLanguageChanged();
  }

  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged() {
    return this._language.isLanguageChanged().subscribe(data => { });
  }
}
