import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { PasswordRecoverComponent } from './password-recover/password-recover.component';
import { NewUserComponent } from './new-user/new-user.component';
import { NewPasswordRequiredComponent } from './new-password-required/new-password-required.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RecoverCodeComponent } from './recover-code/recover-code.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    PasswordRecoverComponent,
    NewUserComponent,
    NewPasswordRequiredComponent,
    ChangePasswordComponent,
    RecoverCodeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
