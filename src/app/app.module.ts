import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlideshowModule } from 'ng-simple-slideshow';

//firebase settings
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

//file storage
import { FileUploadComponent } from './shared/dropzone/fileupload.component';
import { DropZoneDirective } from './shared/dropzone/dropzone.directive';
import { FileSizePipe } from './shared/dropzone/filesize.pipe';

//Komponente u samoj aplikaciji
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AboutusComponent } from './shared/aboutus/aboutus.component';
import { CostummaterialModule } from './costummaterial.module';
import { SettingsComponent } from './settings/settings.component';
import { SetproductComponent } from './admin/setproduct/setproduct.component';
import { AdmincartsComponent } from './admin/admincarts/admincarts.component';
import { AdmintabComponent } from './admin/admintab/admintab.component';
import { AdminusersComponent } from './admin/adminusers/adminusers.component';
import { CartsComponent } from './user/carts/carts.component';
import { LoginComponent } from './user/login/login.component';
import { OrdersComponent } from './user/orders/orders.component';
import { ProductComponent } from './user/product/product.component';
import { UserComponent } from './user/user/user.component';
import { CategoryComponent } from './admin/category/category.component';
import { BrowseComponent } from './shared/aboutus/browse/browse.component';
import { FaqComponent } from './shared/aboutus/faq/faq.component';
import { AboutComponent } from './shared/aboutus/about/about.component';
import { LocationComponent } from './shared/aboutus/location/location.component';
import { TermsComponent } from './shared/aboutus/terms/terms.component';
import { HelpComponent } from './shared/help/help.component';
import { AdminordersComponent } from './admin/adminorders/adminorders.component';
import { AdministrativesComponent } from './admin/administratives/administratives.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AboutusComponent,
    SettingsComponent,
    SetproductComponent,
    AdmincartsComponent,
    AdmintabComponent,
    AdminusersComponent,
    CartsComponent,
    LoginComponent,
    OrdersComponent,
    ProductComponent,
    UserComponent,
    CategoryComponent,
    FileUploadComponent,
    DropZoneDirective,
    FileSizePipe,
    BrowseComponent,
    FaqComponent,
    AboutComponent,
    LocationComponent,
    TermsComponent,
    HelpComponent,
    AdminordersComponent,
    AdministrativesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CostummaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SlideshowModule,
    AngularFireModule.initializeApp(environment.firebase, 'onlineStore'),   // imports firebase/app needed for everything
    AngularFirestoreModule,                                                 // imports firebase/firestore, only needed for database features
    AngularFireAuthModule,                                                  // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule                                                // imports firebase/storage only needed for storage features
  ],
  exports: [

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
