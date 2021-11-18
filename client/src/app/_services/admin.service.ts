import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retryWhen } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  getUersWithRoles(){
    // this is return a partial of our users, because we are getting back only some 
    // properties of the users back
    return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/users-with-roles');
  }
}
