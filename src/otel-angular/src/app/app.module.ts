import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { OpenTelemetryInterceptor } from 'src/opentelemetry/interceptor';

@NgModule({
  declarations: [
    AppComponent, 
    HelloComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule,
    HttpClientModule
     ],
     
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OpenTelemetryInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
