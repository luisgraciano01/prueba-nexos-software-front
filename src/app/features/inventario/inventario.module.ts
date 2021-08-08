import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioRoutingModule } from './inventario-routing.module';
import { InventarioComponent } from './inventario.component';
import { RegistrarMercanciaComponent } from './pages/registrar-mercancia/registrar-mercancia.component';
import { EditarMercanciaComponent } from './pages/editar-mercancia/editar-mercancia.component';
import { ConsultarMercanciaComponent } from './pages/consultar-mercancia/consultar-mercancia.component';

@NgModule({
  declarations: [
    InventarioComponent,
    RegistrarMercanciaComponent,
    EditarMercanciaComponent,
    ConsultarMercanciaComponent,
  ],
  imports: [CommonModule, InventarioRoutingModule],
})
export class InventarioModule {}
