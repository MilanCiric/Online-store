
import { AboutusComponent } from './shared/aboutus/aboutus.component';
import { SettingsComponent } from './settings/settings.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
//import { SetproductComponent } from './admin/setproduct/setproduct.component';

import { AdmintabComponent } from './admin/admintab/admintab.component';
import { CartsComponent } from './user/carts/carts.component';
import { LoginComponent } from './user/login/login.component';
import { ProductComponent } from './user/product/product.component';
import { UserComponent } from './user/user/user.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthGuardAdminService } from './services/auth-guard-admin.service';
import { HelpComponent } from './shared/help/help.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'admin', component: AdmintabComponent, canActivate: [AuthGuardAdminService] },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuardService] },
  { path: 'product', component: ProductComponent, canActivate: [AuthGuardService] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
  { path: 'help', component: HelpComponent },
  { path: 'cart', component: CartsComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
