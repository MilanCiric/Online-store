import { Component, OnInit } from '@angular/core';
import { moveIn, fallIn } from '../router.animation';
import { LanguageService } from './../../services/language.service';

@Component({
  selector: 'aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css'],
  animations: [moveIn(), fallIn()],
  host: { '[@moveIn': '' }
})
export class AboutusComponent implements OnInit {
  state: string = '';

  constructor(public _language: LanguageService) { }

  ngOnInit() {
    this.isLanguageChanged();
  }
  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged() {
    return this._language.isLanguageChanged().subscribe(data => { });
  }
}
