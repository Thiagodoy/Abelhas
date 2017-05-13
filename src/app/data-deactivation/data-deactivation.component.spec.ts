/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DataDeactivationComponent } from './data-deactivation.component';

describe('DataDeactivationComponent', () => {
  let component: DataDeactivationComponent;
  let fixture: ComponentFixture<DataDeactivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataDeactivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDeactivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
