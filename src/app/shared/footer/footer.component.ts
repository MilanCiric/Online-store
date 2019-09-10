import { Component, OnInit, Input } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { LanguageService } from './../../services/language.service';


@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {

  constructor(public _language: LanguageService) {
       
  }
  ngOnInit() {

  }

}
