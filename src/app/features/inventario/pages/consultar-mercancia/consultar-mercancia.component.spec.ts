import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarMercanciaComponent } from './consultar-mercancia.component';

describe('ConsultarMercanciaComponent', () => {
  let component: ConsultarMercanciaComponent;
  let fixture: ComponentFixture<ConsultarMercanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarMercanciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarMercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
