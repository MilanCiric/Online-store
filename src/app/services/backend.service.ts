import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private itemsCollection: AngularFirestoreCollection<any>;
  private itemDoc: AngularFirestoreDocument<any>;
  item: Observable<any>;


  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private http: HttpClient) {
  }
  //prikuplja konfiguraciju iz environment fajla
  getConfig() {
    return environment.social;
  }
  //Funkcija koja nam vraca vremensku markicu, sa trenutnim sistemskim vremenom
  get timestamp() {
    var d = new Date();
    return d;
    //return firebase.firestore.FieldValue.serverTimestamp(); //vraca serversko vreme ako je potrebno da njega pamtimo
  }

  //--------------------------------------------------------------------------------------------------------------------
  //Funkcije za rad sa proizvodima--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------

  //Funkcija koja pribavlja dokumenat iz baze
  getDoc(collUrl: string) {
    this.itemDoc = this.afs.doc<any>(collUrl);
    return this.itemDoc.valueChanges();
  }

  //Pribavlja jedan dokumenat iz baze u zavisnosti od ID-a
  getOneDoc(coll: string, docId) {
    let docUrl = this.getCollectionURL(coll) + "/" + docId;
    this.itemDoc = this.afs.doc<any>(docUrl);
    return this.itemDoc.valueChanges();
  }

  //Funkcija koja pribavlja link nase kolekcije iz baze, odnosno pribavlja referencu nase konkretne baze sajta
  getCollectionURL(filter) {
    return "onlinestore/Milan/" + filter;
  }

  //Funkcija koja pribavlja dokumente iz baze, konkretno sve dokumente bez filtriranja
  getDocs(coll: string) {
    this.itemsCollection = this.afs.collection<any>(this.getCollectionURL(coll), ref => ref.orderBy('lname', 'asc'));
    return this.itemsCollection.valueChanges();
  }
  //Funkcija koja pribavlja kategorije i proizvođače
  getCategoryAndManufacturer(coll: string) {
    this.itemsCollection = this.afs.collection<any>(this.getCollectionURL(coll), ref => ref.orderBy('name', 'asc'));
    return this.itemsCollection.valueChanges();
  }
  getAdministratives(coll: string) {
    this.itemsCollection = this.afs.collection<any>(this.getCollectionURL(coll));
    return this.itemsCollection.valueChanges();
  }

  //Funkcija koja pribavlja filtrirane podatke iz baze
  getFilterDocs(coll: string, filters) {
    return this.afs.collection(this.getCollectionURL(coll), ref =>
      ref.where('delete_flag', '==', 'N')
        .where('scategory', '==', filters.name)
        .where('category', '==', filters.category)
        .orderBy('name', 'asc')
        .orderBy('lname', 'asc')
    )
      .snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      });
  }

  //Funkcija koja vrsi pretragu u bazi po imenu i nalazi sve one koji pocinju sa kriterijumom filter
  Search(coll: string, filters) {
    return this.afs.collection(this.getCollectionURL(coll), ref =>
      ref.where('delete_flag', '==', 'N')
        .orderBy('name')
        .startAt(filters)
        .endAt(filters + "\uf8ff")
    )
      .snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      });
  }

  //Funkcija koja upisuje odnosno kreira jedan dokumenat u bazi sa svim zadatim parametrima koje joj prosledjujemo
  setDocs(coll: string, data: any, docId?: any) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(item.id);
    return docRef.set({
      ...data,
      _id: id,
      updateAt: timestamp,
      createAt: timestamp,
      delete_flag: "N",
      authid: this.afAuth.auth.currentUser.uid,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email
    });
  }

  //Funkcija koja podešava administrativne podatke
  setAdministratives(coll: string, data: any) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL(coll)).doc('administratives');
    return docRef.update({
      euro: data.euro,
      pdv: data.pdv,
      usd: data.usd,
      _id: id,
      updateAt: timestamp,
      authid: this.afAuth.auth.currentUser.uid,
      username: this.afAuth.auth.currentUser.displayName,
    });
  }

  //Funkcija koja postavlja  popuste
  setDiscount(coll: string, data: any, type: string) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(type);
    return docRef.update({
      array: data,
      _id: id,
      updateAt: timestamp,
      authid: this.afAuth.auth.currentUser.uid,
      username: this.afAuth.auth.currentUser.displayName,
    });
  }

  //Funkcija koja dodeljuje svim proizvodima iste vrste popust
  setDiscountsProducts(data: any) {
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL('product')).doc(data._id);
    return docRef.update({
      discount: data.discount,
      updateAt: timestamp,
      authid: this.afAuth.auth.currentUser.uid,
      username: this.afAuth.auth.currentUser.displayName,
    });
  }

  //Funkcija koja iz baze pribavlja niz popusta koji postoji
  getDiscounts() {
    this.itemsCollection = this.afs.collection<any>(this.getCollectionURL('discounts'));
    return this.itemsCollection.valueChanges();
  }

  //Funkcija koja vrsi pretragu u bazi po imenu i nalazi sve one koji pocinju sa kriterijumom filter
  findProducts(type: string,filters:any) {
    return this.afs.collection(this.getCollectionURL('product'), ref =>
      ref.where(type, '==', filters)
        .orderBy('name')
    )
      .snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      });
  }
  //Funkcija koja postavlja proizvođača ili kategoriju u zavisnosti od odabira potrebe
  setCategoryAndManufacturer(coll: string, data: any, docId?: any) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(item.id);
    return docRef.set({
      ...data,
      _id: id,
      updateAt: timestamp,
      createAt: timestamp,
      discount: 0,
      expirationDiscountDate: timestamp,
      authid: this.afAuth.auth.currentUser.uid,
    });
  }

  //Azurira dokumente u bazi
  updateDocs(coll: string, data: any, docId?: any) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(data._id);
    return docRef.update({
      ...data,
      updateAt: timestamp,
      authid: this.afAuth.auth.currentUser.uid,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email
    });
  }

  //funkcija za promenu imena kategorije
  renameCategory(coll: string, catId: string, catName: string) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(catId);
    return docRef.update({
      name: catName,
      updateAt: timestamp,
      authid: this.afAuth.auth.currentUser.uid,
      username: this.afAuth.auth.currentUser.displayName,
    });
  }

  //Brise jedan dokumenat u bazi, konkretno ovo je meko brisanje, tako sto je zastavica za brisanje prebaci na Y 
  //(yes - sto znaci obrisan) i onda se on ne cita iz baze od strane korisnika
  softDelOneDoc(coll: string, docId) {
    const id = this.afs.createId();
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(docId);
    return docRef.update({
      delete_flag: "Y",
      updateAt: timestamp,
      authid: this.afAuth.auth.currentUser.uid,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email
    });
  }

  //Funkcija za totalno brisanje dokumenta
  deleteDoc(coll: string, docId) {
    const id = this.afs.createId();
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(docId);
    return docRef.delete();
  }

  //Funkcija za brisanje jedne kategorije iz baze
  delOneCategory(coll: string, docId) {
    const id = this.afs.createId();
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(docId);
    return docRef.delete();
  }

  //--------------------------------------------------------------------------------------------------------------------
  //Funkcije za rad sa korisnickim podacima-----------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------

  //Funkcija koja ucitava sve korisnike
  getAllUsers() {
    this.itemsCollection = this.afs.collection<any>(this.getCollectionURL('users'), ref => ref.orderBy('isadmin'));
    return this.itemsCollection.valueChanges();
  }

  //Funkcija koja vraca informacije o trenutnom korisniku
  getUserInfo(userId) {
    this.itemsCollection = this.afs.collection<any>(this.getCollectionURL('users'), ref =>
      ref.where('_id', '==', userId));
    return this.itemsCollection.valueChanges();
  }


  //Funkcija koja vraca korisnicke podatke iz autentifikacionog dela firebase servisa
  getUserCredentials() {
    return this.afAuth.auth.currentUser;
  }

  //Funkcija za zuriranje korisnickih podataka
  updateUser(data: any) {
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL('users')).doc(data._id);
    return docRef.update({
      ...data,
      updateAt: timestamp,
      createAt: timestamp,
      delete_flag: "N",
      authid: this.afAuth.auth.currentUser.uid,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email
    });
  }
  //Funkcija za upis korisnika u bazu po prvi put
  setUser(data: any) {
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL('users')).doc(data._id);
    return docRef.set({
      ...data,
      updateAt: timestamp,
      createAt: timestamp,
      delete_flag: "N",
      authid: this.afAuth.auth.currentUser.uid,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email
    });
  }

  //--------------------------------------------------------------------------------------------------------------------
  //Funkcije za rad sa korisnickim korpama------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------

  //Funkcija koja upisuje sadrzaj korpe u bazu
  setShoppingCart(coll: string, data: any, total: number, username: string) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(item.id);
    return docRef.set({
      listOfProducts: data,
      _id: id,
      name: this.afAuth.auth.currentUser.uid,
      updateAt: timestamp,
      createAt: timestamp,
      purshedAt: timestamp,
      delete_flag: "N",
      grandTotal: total,
      authid: this.afAuth.auth.currentUser.uid,
      username: username,
      useremail: this.afAuth.auth.currentUser.email
    });
  }

  //Funkcija za ucitavanje svih korpi
  getAllCarts() {
    this.itemsCollection = this.afs.collection<any>(this.getCollectionURL('carts'), ref => ref.orderBy('updateAt'));
    return this.itemsCollection.valueChanges();
  }

  //Funkcija koja uklanja jednu korpu iz baze
  deleteShoppingCart(docId) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL('carts')).doc(docId);
    return docRef.delete();
  }

  //Uklanja sa lagera, odnosno smanjuje vrednost postojanja jednog artikla na lageru
  removeFromStock(docId, stock: any) {
    const id = this.afs.createId();
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL('product')).doc(docId);
    return docRef.update({
      delete_flag: "N",
      updateAt: timestamp,
      stock: stock,
      authid: this.afAuth.auth.currentUser.uid,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email
    });
  }

  //Uzima stanje na lageru za odredjeni proiyvod
  getStock(itemId) {
    return this.afs.collection(this.getCollectionURL('product'), ref =>
      ref.where('delete_flag', '==', 'N')
        .where('_id', '==', itemId)
    )
      .snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      });
  }

  //Funkcija koja azurira sadrzaj korpe ako postoji u bazi
  updateShoppingCart(coll: string, data: any, check: number, docId: any, total: number, username: string) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp;
    if (check == 0) {
      var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(docId);
      return docRef.update({
        listOfProducts: data,
        updateAt: timestamp,
        grandTotal: total,
        delete_flag: "N",
        authid: this.afAuth.auth.currentUser.uid,
        username: username,
        useremail: this.afAuth.auth.currentUser.email
      });
    }
    else {
      var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(docId);
      return docRef.update({
        listOfProducts: data.listOfProducts,
        grandTotal: total
      });
    }
  }

  //Funksija koja proverava da li postoji aktuelna korpa u bazi za datog korisnika
  isInTheCarts(cartId) {
    return this.afs.collection(this.getCollectionURL('carts'), ref =>
      ref.orderBy('name')
        .startAt(cartId)
        .endAt(cartId + "\uf8ff")
    )
      .snapshotChanges().map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      });
  }

  //--------------------------------------------------------------------------------------------------------------------
  //Funkcije za rad sa narudzbenicama-----------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------

  //Funkcija koja vraca sve porudzbenice
  getAllOrders() {
    this.itemsCollection = this.afs.collection<any>(this.getCollectionURL('orders'), ref => ref.orderBy('updateAt'));
    return this.itemsCollection.valueChanges();
  }

  //Funkcija koja vraca sve porudzbenice od jednog korisnika
  getUserOrders(userId) {
    this.itemsCollection = this.afs.collection<any>(this.getCollectionURL('orders'), ref =>
      ref.where('authid', '==', userId)
        .orderBy('updateAt'));
    return this.itemsCollection.valueChanges();
  }

  //Funkcija koja prosledjuje porudzbenicu u bazu
  makeOrder(data: any, total: number, username: string) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL('orders')).doc(item.id);
    return docRef.set({
      listOfProducts: data,
      _id: id,
      name: this.afAuth.auth.currentUser.uid,
      updateAt: timestamp,
      createAt: timestamp,
      purshedAt: timestamp,
      delete_flag: "N",
      grandTotal: total,
      username: username,
      authid: this.afAuth.auth.currentUser.uid,
      useremail: this.afAuth.auth.currentUser.email
    });
  }

  //Funkcija koja uklanja jednu porudzbenicu iz baze
  deleteOrder(docId) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL('orders')).doc(docId);
    return docRef.delete();
  }

  //--------------------------------------------------------------------------------------------------------------------
  //Funkcije za utvrdjivanje autenticnosti, prijavljivanje i odjavljivanje----------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------

  //Funkcija koja vraca ID korisnika
  userId() {
    let id = this.isUserLoggedin() ? this.afAuth.auth.currentUser.uid : '';
    return id;
  }

  //Funkcija koja nam sluzi da pribavi autentifikaciju nakon sto se izvrsi redirektovano prijavljivanje
  redirectLogin() {
    return this.afAuth.auth.getRedirectResult();
  }

  //Funnkcionalnost koja nam omogucava logovanje putem sifre i maila ali isto tako i preko drustvenih mreza
  login(loginType, formData?) {
    if (formData) {
      return this.afAuth.auth.signInWithEmailAndPassword(formData.email, formData.password).finally(() => {
        window.location.reload();
      });
    }
    else {
      let loginMethod;
      switch (loginType) {
        case 'FB': { loginMethod = new firebase.auth.FacebookAuthProvider(); } break;
        case 'GOOGLE': { loginMethod = new firebase.auth.GoogleAuthProvider(); } break;
      }
      return this.afAuth.auth.signInWithRedirect(loginMethod);
    }
  }

  //Funkcija koja nam omogucava registrovanje na sistem
  singUp(formData) {
    return this.afAuth.auth.createUserWithEmailAndPassword(formData.email, formData.password).catch(error => {
      console.log(error);
    });
  }

  //Funkcija za odjavljivanje sa stranice
  logout() {
    return this.afAuth.auth.signOut();
  }

  //Funkcija koja proverava da li je korisnik logovan ili nije
  isUserLoggedin(): Observable<boolean> {
    return Observable.from(this.afAuth.authState)
      .take(1)
      .map(state => !!state)
      .do(authenticated => {
        return authenticated;
      });
  }

  //Funkcija koja proverava da li je trenutni korisnik koji je prijavljen na sistem administrator ili ne
  isUserAdmin() {
    let collUrl = !this.isUserLoggedin() ? "" : this.afAuth.auth.currentUser.uid;
    collUrl = "onlinestore/Milan/users/" + collUrl;
    return this.getDoc(collUrl);
  }

  //Funkcija koja suspenduje korisnika i ne dozvoljava mu da kupuje, vec samo da gleda proizvode
  suspendUser(userId) {
    return this.afs.collection(this.getCollectionURL('users')).doc(userId)
      .update({
        suspended: true
      });
  }

  //Funkcija koja ponovo aktivira korisnika da moze da kupuje proizvode
  activateUser(userId) {
    return this.afs.collection(this.getCollectionURL('users')).doc(userId)
      .update({
        suspended: false
      });
  }

  //Funkcija koja od obicnog korisnika pravi administratora
  makeAdmin(userId) {
    return this.afs.collection(this.getCollectionURL('users')).doc(userId)
      .update({
        isadmin: true
      });
  }

  //Funkcija koja od administratora pravi obicnog korisnika
  demoteAdmin(userId) {
    return this.afs.collection(this.getCollectionURL('users')).doc(userId)
      .update({
        isadmin: false
      });
  }

  //--------------------------------------------------------------------------------------------------------------------
  //Funkcije za za prikupljanje interesovanja i slicnih informacija od vaznosti-----------------------------------------
  //--------------------------------------------------------------------------------------------------------------------

  //Funkcija koja nam belezi sva interesovanja korisnika prilikom pregleda proizvoda koji ga zanima
  updateShoppingInterest(data: any) {
    const id = this.afs.createId();
    const item = { id, name };
    const timestamp = this.timestamp;
    var docRef = this.afs.collection(this.getCollectionURL('interests')).doc(item.id);
    return docRef.set({
      ...data,
      _id: id,
      updateAt: timestamp,
      createAt: timestamp,
      delete_flag: "N",
      authid: this.afAuth.auth.currentUser.uid,
      username: this.afAuth.auth.currentUser.displayName,
      useremail: this.afAuth.auth.currentUser.email
    });
  }

  //--------------------------------------------------------------------------------------------------------------------
  //Funkcije za rad sa slikama------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------

  //Funkcija koja postavlja sliku proizvoda ili korisnika
  setPic(filePath, coll, docId) {
    console.log(filePath);
    console.log(this.getCollectionURL(coll));
    console.log(docId);
    let docRef = this.afs.collection(this.getCollectionURL(coll)).doc(docId);
    return docRef.update({
      path: filePath
    });
  }

  setUserPic(filePath, coll, docId) {
    console.log(filePath);
    console.log(this.getCollectionURL(coll));
    console.log(this.afAuth.auth.currentUser.uid);
    let docRef = this.afs.collection(this.getCollectionURL(coll)).doc(this.afAuth.auth.currentUser.uid);
    return docRef.update({
      photoURL: filePath
    });
  }

  //Funkcija koja brise sliku iz baze
  deletePic(coll, docId) {
    var docRef = this.afs.collection(this.getCollectionURL(coll)).doc(docId);
    return docRef.set({
      path: null
    }, { merge: true });
  }
  //--------------------------------------------------------------------------------------------------------------------

}