import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { localStorageBackendProvider } from './server';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './components';
import { JwtInterceptor, ErrorInterceptor } from './server';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { SignupComponent } from './signup';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        SignupComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // create localStorage backend
        localStorageBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }