import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientesFormComponent } from './ingredientes-form.component';

describe('IngredientesFormComponent', () => {
  let component: IngredientesFormComponent;
  let fixture: ComponentFixture<IngredientesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
