import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMercanciaComponent } from './editar-mercancia.component';

describe('EditarMercanciaComponent', () => {
  let component: EditarMercanciaComponent;
  let fixture: ComponentFixture<EditarMercanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarMercanciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarMercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
