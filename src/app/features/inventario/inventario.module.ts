import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioRoutingModule } from './inventario-routing.module';
import { InventarioComponent } from './inventario.component';
import { RegistrarMercanciaComponent } from './pages/registrar-mercancia/registrar-mercancia.component';
import { EditarMercanciaComponent } from './pages/editar-mercancia/editar-mercancia.component';
import { ConsultarMercanciaComponent } from './pages/consultar-mercancia/consultar-mercancia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbAlertModule,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    InventarioComponent,
    RegistrarMercanciaComponent,
    EditarMercanciaComponent,
    ConsultarMercanciaComponent,
  ],
  imports: [
    CommonModule,
    InventarioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbAlertModule,
  ],
})
export class InventarioModule {}
