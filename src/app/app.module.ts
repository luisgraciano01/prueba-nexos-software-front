import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CoreModule } from '@core/core.module';
import { AppConfigService } from '@core/services/app-config.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface ConfigJson {
  apiUrl: string;
}

function initializeAppFactory(
  httpClient: HttpClient,
  appConfigService: AppConfigService
): () => Observable<any> {
  return () =>
    httpClient.get<ConfigJson>('/assets/config.json').pipe(
      tap((config) => {
        appConfigService.apiUrl = config.apiUrl;
      })
    );
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    CoreModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [HttpClient, AppConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
