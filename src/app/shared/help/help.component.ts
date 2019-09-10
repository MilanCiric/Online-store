import { Component, OnInit } from '@angular/core';
import { LanguageService } from './../../services/language.service';


@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {


  constructor(public _language:LanguageService) {

  }

  ngOnInit() {
    this.isLanguageChanged();
  }
  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged(){
    return this._language.isLanguageChanged().subscribe(data=>{});
  }

}
