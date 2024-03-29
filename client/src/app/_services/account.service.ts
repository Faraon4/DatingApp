import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { ArrayType } from '@angular/compiler';


// This service will be used to make requests to out api
// anchor injectable is showing us that we can inject this 
@Injectable({
  providedIn: 'root'
})
export class AccountService {
baseUrl = environment.apiUrl;
private currentUserSource = new ReplaySubject<User>(1); // The reason why this and next variables are observables is because this way that can be observe
                                                        // by other classes , and our auth.guard will need to for allowing to go to specific links
currentUser$ = this.currentUserSource.asObservable(); // Observable objects , by convention at the end of name should have $ sign

// In constructor we inject http client in this service
  constructor(private http: HttpClient) { }

  // this method will receive what we introduce in our form
  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl+'account/register', model).pipe(
      map((user: User) => {
        if(user) {
         // localStorage.setItem('user', JSON.stringify(user));
          this.setCurrentUser(user);
        }
      })
    )
  }

setCurrentUser(user : User) {
  user.roles = [];
  const roles = this.getDecodedToken(user.token).role;

  // now we need to check the const roles, because
  // if the user is login , it is just a simple string the role in the token
  // but if the user has more than one role, it is becoming an array
  // and now we need to make some logic what to do when we have this situation

  Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
  // Having now the information about the roles of the user
  // we can go and greate a new guard for the admin 



  localStorage.setItem('user', JSON.stringify(user));
  this.currentUserSource.next(user);
}

logout() {
  localStorage.removeItem('user');
  this.currentUserSource.next(null!); // In Typescript , to make sure we can use null and the end of null and ! => null!
}


getDecodedToken(token:any){
  return JSON.parse(atob(token.split(".")[1])); // This is the method to get a part of the token
}
}
