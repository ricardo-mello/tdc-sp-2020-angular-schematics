import { getTestBed, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { GroupService } from './group.service';
import * as mocks from '../mocks/group.mocks';

describe('GroupService', () => {
  let injector: TestBed;
  let service: GroupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    injector = getTestBed();

    service = TestBed.inject(GroupService);
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the group list', done => {
    const mock = mocks.list;

    service.getAll().subscribe(groups => {
      expect(groups.length).toBe(4);
      expect(groups).toEqual(mock);
      done();
    });

    const req = httpMock.expectOne(`/group/getlistgroup`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should get a group by id', done => {
    const mock = mocks.entity;

    service.get('3').subscribe(group => {
      expect(group.id).toEqual('3');
      expect(group.name).toEqual('Group CCC');
      done();
    });

    const req = httpMock.expectOne(`/group/3`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  describe('should save a group', () => {
    it('should create if the group has no id', done => {
      const mock = { ...mocks.entity, id: null };

      service.save(mock).subscribe(group => {
        expect(group.id).toEqual('3');
        done();
      });

      const req = httpMock.expectOne(`/group`);
      expect(req.request.method).toBe('POST');
      req.flush(mocks.entity);
    });

    it('should update if the group has id', done => {
      const mock = mocks.entity;

      service.save(mock).subscribe(group => {
        expect(group.id).toEqual('3');
        done();
      });

      const req = httpMock.expectOne(`/group/3`);
      expect(req.request.method).toBe('PUT');
      req.flush(mock);
    });
  });

  it('should toggle group activation', done => {
    const mock = { ...mocks.entity, active: false };

    service.toggleActivation(mock).subscribe(group => {
      expect(group.active).toEqual(false);
      done();
    });

    const req = httpMock.expectOne(
      `/group/activatedeactivategroup/3/false`
    );
    expect(req.request.method).toBe('PUT');
    req.flush(mock);
  });

  it('should delete a group', done => {
    const mock = mocks.entity;

    service.delete(mock.id).subscribe(() => done());

    const req = httpMock.expectOne(`/group/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mock);
  });

  it('should duplicate a group', done => {
    const mock = mocks.entity;

    service.duplicate(mock.id).subscribe(() => done());

    const req = httpMock.expectOne(`/group/duplicate/3`);
    expect(req.request.method).toBe('POST');
    req.flush(mock);
  });
});
