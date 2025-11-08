import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValoresComunesFormComponent } from './valores-comunes-form.component';

describe('ValoresComunesFormComponent', () => {
  let component: ValoresComunesFormComponent;
  let fixture: ComponentFixture<ValoresComunesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValoresComunesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValoresComunesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
