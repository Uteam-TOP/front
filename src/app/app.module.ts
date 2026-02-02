import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuNavComponent } from './components/menu-nav/menu-nav.component';
import { PopUpEntryComponent } from './components/pop-up-entry/pop-up-entry.component';
import { FooterComponent } from './components/footer/footer.component';
import { PopUpErrorCreateComponent } from './components/pop-up-error-create/pop-up-error-create.component';
import { LendingFooterButtonComponent } from "./pages/public-lending/sections/lending-footer-button/lending-footer-button.component";
import {MainMenuComponent} from "./components/main-menu/main-menu.component";
import {authInterceptor} from "./core/interceptors/auth-token.interceptor";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MenuNavComponent,
    PopUpEntryComponent,
    FooterComponent,
    PopUpErrorCreateComponent,
    LendingFooterButtonComponent,
    MainMenuComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
})
export class AppModule { }
