import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioComponent } from './inventario.component';
import { ConsultarMercanciaComponent } from './pages/consultar-mercancia/consultar-mercancia.component';
import { EditarMercanciaComponent } from './pages/editar-mercancia/editar-mercancia.component';
import { RegistrarMercanciaComponent } from './pages/registrar-mercancia/registrar-mercancia.component';

const routes: Routes = [
  {
    path: '',
    component: InventarioComponent,
    children: [
      {
        path: 'consultar-mercancia',
        component: ConsultarMercanciaComponent,
      },
      {
        path: 'registrar-mercancia',
        component: RegistrarMercanciaComponent,
      },
      {
        path: 'editar-mercancia',
        component: EditarMercanciaComponent,
      },
      {
        path: '**',
        redirectTo: 'consultar-mercancia',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventarioRoutingModule {}
