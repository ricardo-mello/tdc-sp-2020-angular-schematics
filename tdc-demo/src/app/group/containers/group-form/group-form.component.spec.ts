import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { PoFieldModule, PoNotificationModule } from '@po-ui/ng-components';
import { of } from 'rxjs';

import { GroupFormComponent } from './group-form.component';
import { CoreTestingModule } from '../../../core/core-testing.module';
import * as mocks from '../../mocks/group.mocks';

describe('GroupFormComponent', () => {
  let component: GroupFormComponent;
  let fixture: ComponentFixture<GroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        PoFieldModule,
        PoNotificationModule
      ],
      declarations: [GroupFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch group after Angular calls ngOnInit', () => {
    const fetchGroup = jest.spyOn(component, 'fetchGroup');

    component.ngOnInit();

    expect(fetchGroup).toHaveBeenCalled();
  });

  it('should fetch a group if the route have a group id', done => {
    const mock = mocks.entity;
    const id = '3';

    const getGroup = jest
      .spyOn(component['groupService'], 'get')
      .mockReturnValue(of(<any>mock));

    component['route'].snapshot.params = { id };
    component.fetchGroup();

    expect(getGroup).toHaveBeenCalledWith(id);

    const form = component.groupForm.value;
    expect(form.id).toEqual(mock.id);
    expect(form.name).toEqual(mock.name);
    expect(form.active).toEqual(mock.active);

    done();
  });

  describe('should save a group on backend', () => {
    it('should not submit if form is not valid', () => {
      const save = jest.spyOn(component['groupService'], 'save');
      const warning = jest.spyOn(
        component['poNotificationService'],
        'warning'
      );

      const success = jest.spyOn(
        component['poNotificationService'],
        'success'
      );

      component.groupForm.patchValue({ name: '' });

      component.onSubmit(component.groupForm);

      expect(warning).toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      expect(success).not.toHaveBeenCalled();
    });

    it('should submit if form is valid', () => {
      const mock = mocks.entity;

      const save = jest
        .spyOn(component['groupService'], 'save')
        .mockReturnValue(of(<any>{}));

      const warning = jest.spyOn(
        component['poNotificationService'],
        'warning'
      );

      const success = jest.spyOn(
        component['poNotificationService'],
        'success'
      );

      const navigate = jest
        .spyOn(component['router'], 'navigate')
        .mockReturnValue(null);

      component.groupForm.patchValue(mock);

      component.onSubmit(component.groupForm);

      expect(warning).not.toHaveBeenCalled();

      expect(save).toHaveBeenCalledWith(mock);
      expect(success).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith(['/groups']);
    });
  });
});
