/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditMultipleApiaryComponent } from './edit-multiple-apiary.component';

describe('EditMultipleApiaryComponent', () => {
  let component: EditMultipleApiaryComponent;
  let fixture: ComponentFixture<EditMultipleApiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMultipleApiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMultipleApiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
