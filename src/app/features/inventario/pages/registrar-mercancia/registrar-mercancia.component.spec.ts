import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarMercanciaComponent } from './registrar-mercancia.component';

describe('RegistrarMercanciaComponent', () => {
  let component: RegistrarMercanciaComponent;
  let fixture: ComponentFixture<RegistrarMercanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarMercanciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarMercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
