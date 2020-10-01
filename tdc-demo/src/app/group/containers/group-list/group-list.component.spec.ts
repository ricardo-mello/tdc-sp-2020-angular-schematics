import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PoModalModule, PoToasterOrientation } from '@po-ui/ng-components';
import { of } from 'rxjs';

import { CoreTestingModule } from '../../../core/core-testing.module';
import { GroupListComponent } from './group-list.component';
import * as mocks from '../../mocks/group.mocks';
import { Router } from '@angular/router';

describe('GroupListComponent', () => {
  let router: Router;

  let component: GroupListComponent;
  let fixture: ComponentFixture<GroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, RouterTestingModule, PoModalModule],
      declarations: [GroupListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.loaded).toBeFalsy();
    expect(component.loading).toBeFalsy();
    expect(component.groups).toBeUndefined();
  });

  it('should have a breadcrumb initialized', () => {
    expect(component.breadcrumb.items[0].label).toEqual('Home');
    expect(component.breadcrumb.items[1].label).toEqual('Groups');
    expect(component.breadcrumb.items.length).toEqual(2);
  });

  it('should have an action that redirects to create page', () => {
    expect(component.pageActions[0].label).toEqual('Add Group');
    expect(component.pageActions.length).toEqual(1);

    const navigate = jest.spyOn(router, 'navigate').mockReturnValue(null);

    component.pageActions[0].callback();
    expect(navigate).toHaveBeenCalledWith(['create'], {
      relativeTo: component['route']
    });
  });

  it('should have table actions initialized', () => {
    const mock = mocks.entity;
    const navigateSpy = jest.spyOn(router, 'navigate').mockReturnValue(null);
    const duplicateSpy = jest.spyOn(component, 'openDuplicateModal');
    const deleteSpy = jest.spyOn(component, 'openDeleteModal');

    expect(component.tableActions.length).toEqual(3);
    // @ts-ignore
    component.tableActions[0].action(mock);

    expect(navigateSpy).toHaveBeenCalledWith(['edit', '3'], {
      relativeTo: component['route']
    });

    // @ts-ignore
    component.tableActions[1].action(mock);
    expect(duplicateSpy).toHaveBeenCalled();

    // @ts-ignore
    component.tableActions[2].action(mock);
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should fetch groups after Angular calls ngOnInit ', fakeAsync(() => {
    const getList = spyOn(
      component['groupService'],
      'getAll'
    ).and.returnValue(of(mocks.list));

    component.ngOnInit();
    tick();

    expect(getList).toHaveBeenCalled();
    expect(component.groups).toEqual(mocks.list);
    expect(component.loaded).toBeTruthy();
  }));

  it('should search a group by name', () => {
    component.groups = mocks.list;

    component.search('');
    expect(component.filteredGroups).toEqual(mocks.list);

    component.search('CCC');
    expect(component.filteredGroups).toEqual([mocks.list[2]]);
  });

  it('should toggle activation', fakeAsync(() => {
    const group = mocks.list[0];

    const toggle = spyOn(
      component['groupService'],
      'toggleActivation'
    ).and.returnValue(of({}));

    component.toggleActivation(group);

    expect(toggle).toHaveBeenCalledWith(group);
  }));

  describe('should duplicate', () => {
    it('should open duplicate modal', fakeAsync(() => {
      const group = mocks.list[0];
      component.openDuplicateModal(group);

      tick();
      fixture.detectChanges();

      expect(component.duplicateModal.isHidden).toBeFalsy();
    }));

    it('should have primary and secondary actions', fakeAsync(() => {
      const group = mocks.list[0];
      const duplicateSpy = spyOn(component, 'duplicateGroup');
      const closeModalSpy = spyOn(component.duplicateModal, 'close');

      component.openDuplicateModal(group);
      tick();

      component.modalActions.primary.action();
      expect(duplicateSpy).toHaveBeenCalledWith(group);

      component.openDuplicateModal(group);
      tick();

      component.modalActions.secondary.action();
      expect(closeModalSpy).toHaveBeenCalled();
    }));

    it('should duplicate', done => {
      const group = mocks.list[0];

      const fetchItems = spyOn(component, 'fetchList');
      const duplicate = spyOn(
        component['groupService'],
        'duplicate'
      ).and.returnValue(of({}));
      const success = spyOn(component['poNotificationService'], 'success');

      component.duplicateGroup(group);

      expect(duplicate).toHaveBeenCalledWith(group.id);
      expect(fetchItems).toHaveBeenCalled();
      expect(component.duplicateModal.isHidden).toBeTruthy();

      expect(success).toHaveBeenCalledWith({
        message: 'Group successfully duplicated',
        orientation: PoToasterOrientation.Top
      });

      done();
    });
  });

  describe('should delete', () => {
    it('should open delete modal', fakeAsync(() => {
      const group = mocks.list[0];
      component.openDeleteModal(group);

      tick();
      fixture.detectChanges();

      expect(component.deleteModal.isHidden).toBeFalsy();
    }));

    it('should have primary and secondary actions', fakeAsync(() => {
      const group = mocks.list[0];
      const deleteSpy = spyOn(component, 'deleteGroup');
      const closeModalSpy = spyOn(component.deleteModal, 'close');

      component.openDeleteModal(group);
      tick();

      component.modalActions.primary.action();
      expect(deleteSpy).toHaveBeenCalledWith(group);

      component.openDeleteModal(group);
      tick();

      component.modalActions.secondary.action();
      expect(closeModalSpy).toHaveBeenCalled();
    }));

    it('should delete', done => {
      const group = mocks.list[0];

      const fetchItems = spyOn(component, 'fetchList');
      const deleteGroup = spyOn(
        component['groupService'],
        'delete'
      ).and.returnValue(of({}));
      const success = spyOn(component['poNotificationService'], 'success');

      component.deleteGroup(group);

      expect(deleteGroup).toHaveBeenCalledWith(group.id);
      expect(fetchItems).toHaveBeenCalled();
      expect(component.deleteModal.isHidden).toBeTruthy();

      expect(success).toHaveBeenCalledWith({
        message: 'Group successfully removed',
        orientation: PoToasterOrientation.Top
      });

      done();
    });
  });
});
