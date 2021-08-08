import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SessionService } from '@core/services/session.service';
import { UsuarioService } from '@core/services/usuario.service';
import { AppConfigService } from '@core/services/app-config.service';

/**
 * Módulo `Core` que contiene los componentes, servicios y demás
 * utilidades comunes entre la mayoría de los módulos de la aplicación.
 *
 * En este módulo se centra el código que sin estos dejaría de funcionar gran parte la aplicación.
 */
@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [AppConfigService, SessionService, UsuarioService],
})
export class CoreModule {}
