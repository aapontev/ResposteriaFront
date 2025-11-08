import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValoresComunesListComponent } from './valores-comunes-list.component';

describe('ValoresComunesListComponent', () => {
  let component: ValoresComunesListComponent;
  let fixture: ComponentFixture<ValoresComunesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValoresComunesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValoresComunesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
