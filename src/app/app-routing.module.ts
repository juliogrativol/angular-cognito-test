import { ChangePasswordComponent } from './change-password/change-password.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { PasswordRecoverComponent } from './password-recover/password-recover.component';
import { AuthGuard } from './auth.guard';
import { NewUserComponent } from './new-user/new-user.component';
import { NewPasswordRequiredComponent } from './new-password-required/new-password-required.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login'},
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'recuperarSenha', component: PasswordRecoverComponent },
  { path: 'newUser', component: NewUserComponent },
  { path: 'newPasswordRequired', component: NewPasswordRequiredComponent },
  { path: 'newPassword', component: ChangePasswordComponent },
  // otherwise redirect to home
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }