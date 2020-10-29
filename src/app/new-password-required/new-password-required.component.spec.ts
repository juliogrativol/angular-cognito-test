import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordRequiredComponent } from './new-password-required.component';

describe('NewPasswordRequiredComponent', () => {
  let component: NewPasswordRequiredComponent;
  let fixture: ComponentFixture<NewPasswordRequiredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPasswordRequiredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasswordRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
