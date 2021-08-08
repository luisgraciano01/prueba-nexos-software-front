import { Component, OnInit } from '@angular/core';
import { IUsuario } from '@core/interfaces/usuario';
import { SessionService } from '@core/services/session.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss'],
})
export class InventarioComponent implements OnInit {
  public usuario: IUsuario;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.usuario = this.sessionService.getCurrentUser();
  }

  terminateSession() {
    this.sessionService.terminateSession();
  }
}
