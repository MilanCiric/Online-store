import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/RX';
import {BackendService} from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  temp: any;
  Selectedlang: string = 'EN'
  langDataFinal;
  languages = [
    { selector: "EN", name: "English" },
    { selector: "SR", name: "Serbian" }];
  langData = {
    "EN": {
      name: "English",
      footer: {
        title: "@2019 Copyright Milan Ćirić, all rights reserved."
      },
      header: {

      },
      help: {
        pageTitle: "Help"
      },
      aboutUs: {
        pageTitle: "About us",
        label1: "Browse our produtcs",
        label2: "Terms",
        label3: "FAQ",
        label4: "Our location",
        label5: "About us"
      },
      terms: {
        text: "Terms will be added here"
      },
      location: {
        text: "location of our store"
      },
      faq: {
        text: "Frequently asked questions will be added here"
      },
      user: {
        autorisation: "Your authentications is invalid, please logout and login again. Error",
        nameReq: "Name is Required",
        nameLen5: "Name can't be less than 2 characters",
        nameLen30: "Name can't be more than 30 characters",
        surReq: "Surname is Required",
        surLen5: "Surname can't be less than 5 characters",
        surLen30: "Surname can't be more than 30 characters",
        update: "Update",
        changePic: "Change picture",
        userPanel: "User personal informations",
        status: "status",
        active: "Active",
        suspended: "Suspended",
        name: "Perosnal name",
        name2: "name",
        midname: "Middle name, parent's name",
        midname2: "midname",
        surname: "Surname, familly name",
        surname2: "surname",
        country: "eg. USA",
        country2: "country",
        state: "eg. New York",
        state2: "state",
        city: "Albion",
        city2: "city",
        zip: "10001",
        zipcode: "zipcode",
        tel: "eg. 062/387-899",
        telephone: "telephone",
        lang: "eg. EN",
        language: "Language",
        updated: "Your data is updated",
        close: "Close"
      },
      product: {
        pageTitle: "Shop",
        search: "Search",
        searchTooltip: "Search All",
        cartUpdated: "Shopping cart is updated.",
        matTooltip: "See product details",
        matTooltip2: "Show All Products",
        product: "Product name",
        counts: "Counts",
        price: "Price",
        discount: "Discount",
        shipping: "Shipping",
        total: "Total",
        grandTotal: "Grand total",
        grandTotalPDV: "Grand total + PDV",
        continue: "Continue shopping",
        update: "Update cart",
        category: "Category:",
        scategory: "Manufacturer",
        color: "Color",
        size: "Size",
        priceWithDiscount: "Price with discount",
        addToCart: "Add to Cart",
        problem: "Your user account was suspended so you are not able to order. Talk to admins for resolving situation."
      },
      orders: {
        content: "Cart content of",
        productName: "Product name",
        counts: "Counts",
        price: "Price",
        discount: "Discount [%]",
        shipping: "Shipping",
        total: "Total",
        grandTotal: "Grand total + PDV",
      },
      login: {
        pageTitle: "Autorisation point",
        continue: "Continue Shopping",
        logout: "Logout",
        credentials: "Login credentials are not verified",
        netError: "Network Connection Error",
        login: "Login",
        guest: "Browse as a Guest",
        join: "Join us",
        email: "Email",
        validMail: "Please enter a valid email",
        password: "Password",
        passReq: "Password is required",
        passLen5: "Password can't be less then 5 characters",
        passLen30: "Password can't be more then 30 characters",
        fb: "Login with facebook",
        google: "Login with google",
        singUpUnavailable: "Singup is not possible at the moment",
        singup: "Sing Up",
        back: "Back to login"
      },
      carts: {
        pageTitle: "Shopping cart",
        updated: "Shopping cart is updated.",
        productName: "Product name",
        counts: "Counts",
        price: "Price",
        discount: "Discount [%]",
        shipping: "Shipping",
        total: "Total",
        grandTotal: "Grand total",
        grandTotal2: "Grand total + PDV",
        continue: "Continue shopping",
        updateCart: "Update cart",
        finish: "Finish shopping",
        problem: "Your user account was suspended so you are not able to order. Talk to admins for resolving situation."
      },
      settings: {
        pageTitle: "Settings of ",
        label1: "User information",
        label2: "My orders"
      },
      adminCarts: {
        content: "Cart's content of ",
        product: "Product name",
        counts: "Counts",
        price: "Price",
        discount: "Discount",
        shipping: "Shipping",
        total: "Total",
        grandTotal: "Grand Total",
        grandTotalPDV: "Grand total + PDV",
        delete: "Permanently delete the cart",
        update: "Update Cart"
      },
      administratives: {
        discounts: "Discounts",
        discountDescription: "Here can be changed some actions period",
        saved1: "Save changes of Category discount",
        saved2: "Save changes of Manufacturer discount",
        saved3: "Save changes",
        category: "Category",
        category2: "Discount for category",
        category3: "Discount value for Category [%]",
        manufacturer: "Manufacturer",
        manufacturer2: "Discount for manufacturer",
        manufacturer3: "Discount value for Manufacturer [%]",
        administrative: "Administrative Data",
        administrative2: "Here can be changed some administrative data",
        euro: "Euro",
        euro2: "Value of Euro currency in RSD",
        pdv: "PDV",
        pdv2: "Value of tax: 0 = 0% : 1 = 100%",
        usd: "USD",
        usd2: "Value of USD currency in RSD",
        deleteDisc: "Are you sure want to remove discount for: "
      },
      adminOrders: {
        content: "Cart's content of ",
        product: "Product name",
        counts: "Counts",
        price: "Price",
        discount: "Discount [%]",
        shipping: "Shipping",
        total: "Total",
        grandTotalPDV: "Grand total + PDV",
        delete: "Permanently delete order"
      },
      adminTab: {
        pageTitle: "Administrative tools",
        label1: "Users",
        label2: "Products",
        label3: "Carts",
        label4: "Orders",
        label5: "Category",
        label6: "Administrative data"
      },
      adminUsers: {
        saved: "Data is saved",
        information: "User information of:",
        name: "Name",
        promoteAdmin: "Promote to admin",
        demote: "Demote admin",
        surname: "Surname",
        suspend: "Suspend user",
        mail: "mail",
        activate: "Activate user",
        tel: "Telephone",
        admin: "Admin",
        common: "Common user",
        country: "Country",
        suspendedStatus: "Suspended",
        activeStatus: "Active",
        city: "City",
      },
      category: {
        addCategory: "Add category",
        category: "Category",
        categoryEg: "eg. Mobile phone",
        addManufacturer: "Add Manufacturer",
        manufacturer: "manufacturer",
        manufacturerEg: "eg. Lenovo"
      },
      setProduct: {
        search: "Search",
        search2: "Search recent Results",
        matTooltip1: "Add New product",
        matTooltip2: "Show Recent Results",
        matTooltip3: "Show details with a picture",
        matTooltip4: "Change Picture",
        matTooltip5: "Remove Picture",
        matTooltip6: "Take Piture",
        matTooltip7: "Edit",
        matTooltip8: "Delete",
        matTooltip9: "Delete Document Forever",
        shipping: "Shipping",
        category: "Category",
        manufacturer: "Manufacturer",
        color: "Color",
        size: "Size",
        discount: "Discount [%]",
        price: "Price",
        priceDiscount: "Price with discount",
        name: "Name",
        stock: "Amount on a stock",
        actions: "Actions",
        saved: "Data is saved",
        categoryEg: "eg. laptop",
        manufacturerEg: "eg. lenovo",
        placeholder1: "*IMP*: Search use tags text",
        placeholder2: "Product Name",
        placeholder3: "Short Name",
        placeholder4: "Long Name",
        placeholder5: "Description",
        eg1: "eg. Men,Reading,Glasses",
        eg2: "eg. Shirt",
        eg3: "eg. 0 if no discount if offered",
        eg4: "eg. 0 if no articles on the stock",
        update: "Update",
        error: "Error"
      }
    },
    "SR": {
      name: "Serbian",
      footer: {
        title: "@2019 Sva prava zadrzana od strane Milan-a Ćirić-a."
      },
      header: {

      },
      help: {
        pageTitle: "Pomoć"
      },
      aboutUs: {
        pageTitle: "O nama",
        label1: "Pretraži naše proizvode",
        label2: "Uslovi korišćenja",
        label3: "Često postavljana pitanja",
        label4: "Naša lokacija",
        label5: "Detaljnije o nama"
      },
      terms: {
        text: "Uslovi korišćenja će biti ovde dodati"
      },
      location: {
        text: "Lokacija naše prodavnice"
      },
      faq: {
        text: "Često postavljana pitanja"
      },
      user: {
        autorisation: "Vaša autentifikacija nija validna, molimo vas da se izlogujete pa ulogujete ponovo. Greška",
        nameReq: "Ime je neophodno",
        nameLen5: "Ime ne sme biti kraće od 2 karaktera",
        nameLen30: "Ime ne može biti duže od 30 karaktera",
        surReq: "Prezime je neophodno",
        surLen5: "Prezime ne sme biti kraće od 5 karaktera",
        surLen30: "Prezime ne sme biti duže od 30 karaktera",
        update: "Osveži",
        changePic: "Promeni sliku",
        userPanel: "Korisnikove lične informacije",
        status: "status",
        active: "Aktivan",
        suspended: "Suspendovan",
        name: "Lično ime",
        name2: "Ime",
        midname: "Srednje ime, ime roditelja",
        midname2: "Srednje ime",
        surname: "Prezime, Porodično ime",
        surname2: "Prezime",
        country: "npr. Srbija",
        country2: "Država",
        state: "npr. Srbija",
        state2: "Pokrajina",
        city: "Pirot",
        city2: "Grad",
        zip: "18300",
        zipcode: "Poštanski broj",
        tel: "npr. 062/387-899",
        telephone: "Telefon",
        lang: "npr. SR",
        language: "Jezik",
        updated: "Vaši podaci su osveženi",
        close: "Zatvori"
      },
      product: {
        pageTitle: "Prodavnica",
        search: "Pretraži",
        searchTooltip: "pretraži sve",
        cartUpdated: "Potrošačka korpa je osvežena.",
        matTooltip: "Pogledaj detalje proizvoda",
        matTooltip2: "Prikaži sve proizvode",
        product: "Naziv proizvoda",
        counts: "Količina",
        price: "Cena",
        discount: "Popust",
        shipping: "Dostava",
        total: "Ukupno",
        grandTotal: "Finalna cena",
        grandTotalPDV: "Finalna cena sa PDV-om",
        continue: "Nastavi sa kupovinom",
        update: "Upamti korpu",
        category: "Kategorija:",
        scategory: "Proizvođač:",
        color: "Boja:",
        size: "Veličina:",
        priceWithDiscount: "Cena sa popustom:",
        addToCart: "Dodaj u korpu",
        problem: "Vaš nalog je suspendovan pa iz tog razloga ste onemogućeni da poručite proizvod. Obratite se administratorima radi razrešenja situacije."
      },
      orders: {
        content: "Sadržina korpe korisnika ",
        productName: "Naziv proizvoda",
        counts: "Komada",
        price: "Pojedinačna cena",
        discount: "Popust [%]",
        shipping: "Cena transporta",
        total: "Ukupno",
        grandTotal: "Finalna cena sa PDV-om",
      },
      login: {
        pageTitle: "Mesto autorizacije",
        continue: "Nastavi sa kupovinom",
        logout: "Odjavi se",
        credentials: "Podaci prijavljivanja nisu validni",
        netError: "Greška na mreži",
        login: "Prijavi se",
        guest: "Razgledaj kao gost",
        join: "Pridruži se",
        email: "E-pošta",
        validMail: "Molim vas unesite validnu E-poštu",
        password: "Lozinka",
        passReq: "Lozinka je neophodna",
        passLen5: "Lozinka ne sme biti manja od 5 karaktera",
        passLen30: "Lozinka ne sme biti više od 30 karaktera",
        fb: "Prijavite se preko fejsbuka",
        google: "Prijavite se preko Gugla",
        singUpUnavailable: "Registrovanje novih korisnika trenutno nije moguće",
        singup: "Registruj se",
        back: "Vrati se nazad"
      },
      carts: {
        pageTitle: "Potrošačka korpa",
        updated: "Potrošačka korpa je osvežena.",
        productName: "Naziv proizvoda",
        counts: "Komada",
        price: "Pojedinačna cena",
        discount: "Popust [%]",
        shipping: "Cena transporta",
        total: "Ukupno",
        grandTotal: "Finalna cena",
        grandTotal2: "Finalna cena sa PDV-om",
        continue: "Nastavi kupovinu",
        updateCart: "Upamti korpu",
        finish: "Završi kupovinu",
        problem: "Vaš nalog je suspendovan pa iz tog razloga ste onemogućeni da poručite proizvod. Obratite se administratorima radi razrešenja situacije."
      },
      settings: {
        pageTitle: "Podešavanja korisnika ",
        label1: "Korisnikove lične informacije",
        label2: "Moje porudžbenice"
      },
      adminCarts: {
        content: "Sadržina korpe korisnika ",
        product: "Naziv proizvoda",
        counts: "Količina",
        price: "Cena",
        discount: "Popust [%]",
        shipping: "Dostava",
        total: "Ukupno",
        grandTotal: "Finalna cena",
        grandTotalPDV: "Finalna cena sa PDV-om",
        update: "Zapamti korpu",
        delete: "Trajno obriši korisničkuk korpu"
      },
      administratives: {
        discounts: "Popusti",
        discountDescription: "Ovde se može promeniti akcioni period važenja popusta",
        saved1: "Upamti izmene popusta za kategorije",
        saved2: "Upamti izmene popusta za proizvođača",
        saved3: "Snimi izmene",
        category: "Kategorija",
        category2: "Popust za kategoriju",
        category3: "Vrednost popusta za kategoriju [%]",
        manufacturer: "Proizvođač",
        manufacturer2: "Popust za proizvođača",
        manufacturer3: "Vrednost popusta za proizvođača [%]",
        administrative: "Administrativni podaci",
        administrative2: "Ovde se mogu promeniti administativni podaci",
        euro: "Evro",
        euro2: "Vrednost evra u dinarima",
        pdv: "PDV",
        pdv2: "Vrednost PDV-a: 0 = 0% : 1 = 100%",
        usd: "USD",
        usd2: "Vrednost američkog dolara u dinarima",
        deleteDisc: "Da li želite da poništite popust za: "
      },
      adminOrders: {
        content: "Sadržina korpe korisnika ",
        product: "Naziv proizvoda",
        counts: "Količina",
        price: "Cena",
        discount: "Popust [%]",
        shipping: "Dostava",
        total: "Finalna cena",
        grandTotalPDV: "Finalna cena sa PDV-om",
        delete: "Trajno obriši porudžbenicu"
      },
      adminTab: {
        pageTitle: "Administratorski alati",
        label1: "Korisnici",
        label2: "Proizvodi",
        label3: "Potrošačke korpe",
        label4: "Porudžbenice",
        label5: "Kategorije",
        label6: "Administativni podaci"
      },
      adminUsers: {
        saved: "Podaci su snimljeni",
        information: "Informacije korisnika:",
        name: "Ime",
        promoteAdmin: "Unapredi u admina",
        demote: "Unazadi admina",
        surname: "Prezime",
        suspend: "Suspenduj korisnika",
        mail: "E-pošta",
        activate: "Aktiviraj korisnika",
        tel: "Telefon",
        admin: "Admin",
        common: "Običan korisnik",
        country: "Zemlja",
        suspendedStatus: "Suspendovan",
        activeStatus: "Aktivan",
        city: "Grad",
      },
      category: {
        addCategory: "Dodaj kategoriju",
        category: "Kategorija",
        categoryEg: "npr. Mobilni telefon",
        addManufacturer: "Dodaj proizvođača",
        manufacturer: "Proizvođač",
        manufacturerEg: "npr. Lenovo"
      },
      setProduct: {
        search: "Pretraži",
        search2: "Pretraži skorije rezultate",
        matTooltip1: "Dodaj nov proizvod",
        matTooltip2: "Prikaži skorije rezultate",
        matTooltip3: "Prikaži detalje sa slikom",
        matTooltip4: "Promeni sliku",
        matTooltip5: "Ukloni sliku",
        matTooltip6: "Dodaj sliku",
        matTooltip7: "Edituj",
        matTooltip8: "Obriši",
        matTooltip9: "Obriši dokumen zauvek",
        category: "Kategorija",
        manufacturer: "Proizvođač",
        color: "Boja",
        size: "Veličina",
        discount: "Popust [%]",
        price: "Cena",
        priceDiscount: "Cena sa popustom",
        name: "Ime",
        stock: "Količina na lageru",
        actions: "Akcije",
        shipping: "Dostava",
        saved: "Podaci su snimljeni",
        categoryEg: "npr. laptop",
        manufacturerEg: "npr. lenovo",
        placeholder1: "*VAŽNO*: Pretraga koristi tagove za pretragu",
        placeholder2: "Naziv proizvoda",
        placeholder3: "Kratko ime",
        placeholder4: "Dugačko ime",
        placeholder5: "Opis",
        eg1: "npr. Muške, naočare, za čitanje",
        eg2: "npr. Majca",
        eg3: "npr. 0 je ako nema popusta",
        eg4: "npr. 0 je ako nema artikala na lageru",
        update: "Ažuriraj",
        error: "Greška"
      }
    }
  };
  constructor(public _backendService:BackendService) {
    this.langDataFinal = this.isLanguageChanged();

  }

  //Funkcija koja proverava da li je promenjen jezik ili ne
  isLanguageChanged(): Observable<boolean> {
    return Observable.from(this.Selectedlang)
      .take(1)
      .map(state => !!state)
      .do(authenticated => {
        this.langDataFinal = this.langData[this.Selectedlang];
        if(this._backendService.isUserLoggedin()){
          this._backendService.getUserInfo(this._backendService.userId()).subscribe(data=>{
            this.temp = data;
            this.Selectedlang = this.temp[0].language;
          });
        }
      });
  }
}
