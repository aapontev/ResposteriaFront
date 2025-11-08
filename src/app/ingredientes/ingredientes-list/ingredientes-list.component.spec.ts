import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientesListComponent } from './ingredientes-list.component';

describe('IngredientesListComponent', () => {
  let component: IngredientesListComponent;
  let fixture: ComponentFixture<IngredientesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
