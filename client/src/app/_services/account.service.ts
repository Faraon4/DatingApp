import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { User } from '../_models/user';


// This service will be used to make requests to out api
// anchor injectable is showing us that we can inject this 
@Injectable({
  providedIn: 'root'
})
export class AccountService {
baseUrl = 'http://localhost:5000/api/'; // store value in here, and when user subscribe then it emits the last value or any value that we want
private currentUserSource = new ReplaySubject<User>(1);
currentUser$ = this.currentUserSource.asObservable(); // Observable objects , by convention at the end of name should have $ sign

// In constructor we inject http client in this service
  constructor(private http: HttpClient) { }

  // this method will receive what we introduce in our form
  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl+'account/register', model).pipe(
      map((user: User) => {
        if(user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

setCurrentUser(user : User) {
  this.currentUserSource.next(user);
}

logout() {
  localStorage.removeItem('user');
  this.currentUserSource.next(null!); // In Typescript , to make sure we can use null and the end of null and ! => null!
}
}
