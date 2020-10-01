import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { Group, GroupForm } from '../models/group.model';
import {list} from '../mocks/group.mocks';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private http: HttpClient) {}

  get(id: string) {
    return this.http.get<Group>(`/group/${id}`);
  }

  getAll() {
    return of(list);
    // return this.http
    //   .get<Group[]>(`/group`);
  }

  save(entity: GroupForm): Observable<GroupForm> {
    if (entity.id) {
      return this.http.put<GroupForm>(`/group/${entity.id}`, entity);
    } else {
      return this.http.post<GroupForm>('/group', entity);
    }
  }

  toggleActivation(entity: Group): Observable<Group> {
    return this.http.put<Group>(
      `/group/activatedeactivategroup/${entity.id}/${entity.active}`,
      {}
    );
  }

  delete(id: string) {
    return this.http.delete(`/group/${id}`);
  }

  duplicate(id: string) {
    return this.http.post(`/group/duplicate/${id}`, {});
  }
}
