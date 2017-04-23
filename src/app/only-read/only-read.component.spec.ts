import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlyReadComponent } from './only-read.component';

describe('OnlyReadComponent', () => {
  let component: OnlyReadComponent;
  let fixture: ComponentFixture<OnlyReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlyReadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlyReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
