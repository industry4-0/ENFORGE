import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './services/auth-jwt-services/auth-interceptor';
import { AuthService } from './services/auth-jwt-services/auth.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginModule } from './pages/login/login.module';
import { FormsModule } from '@angular/forms';
import { StockModule } from './pages/stock/stock.module';
import { TaskModule } from './pages/tasks/tasks.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import { PartListModule } from './pages/part-list/part-list.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    PartListModule,
    MatToolbarModule,
    TaskModule,
    StockModule,
    FormsModule,
    LoginModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    MatSnackBarModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }