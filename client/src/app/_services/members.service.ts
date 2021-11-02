import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';



@Injectable({
  providedIn: 'root'
})
export class MembersService {
baseUrl = environment.apiUrl;
members: Member[] = [];
memberCache = new Map();
user!: User;
userParams!: UserParams;

// We want to save our filters as well in the cache ,
// And for doing this we will do what we did in the member list ts component in constructor
// We will inject account service in this service

  

constructor(private http: HttpClient, private accountService: AccountService) {
  this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
    this.user = user;
    this.userParams = new UserParams(user);
  })
 }


  getUserParams(){
    return this.userParams
  }

  setUserParams(params: UserParams){
    this.userParams = params;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams){

      // We implement the cache here
      // and we need now is a bit complicated because we want to remember not just an array of members
      // but we want to remember the query that the user will ask for
      // For example if he asked femaled within a specific age range we want to save this query as well

        //For this we need a specific key to remember and to do this, we are using the next command
  
       // console.log(Object.values(userParams).join('-'));

    // After we use this command in console we will see specific information 
    // And this info we would like to store as a key and then use it
    // And inside the key we will have the response 
    // And for this we will use a map, which is like a dictionary

    // 1. We need to check if we have a particulary result in our cache
      var response = this.memberCache.get(Object.values(userParams).join('-'));
      if(response) {
        return of(response);
      }
      // 2. Now we go to the return from this method (the last one ), and we need to return the result 

                                                                                                  /* | */ 
   let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);            /* | */    
   params = params.append('minAge', userParams.minAge.toString());                                /* | */ 
   params = params.append('maxAge', userParams.maxAge.toString());                                /* | */ 
   params = params.append('gender', userParams.gender);                                           /* | */ 
   params = params.append('orderBy', userParams.orderBy);                                         /* | */ 
                                                                                                  /* | */ 
   return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params)               /*     <----      */  
      .pipe(map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      }))
  }




  getMember(username:string){
    // First of all we check if this member is in our member cache
   // console.log(this.memberCache);
    // wE DO NOT need the keys we need the value

    const member = [...this.memberCache.values()]
     // console.log(member); // Using this we see, that all the time we add a new array to the existed array of our members
    // and for doing what we need to do , we will use the reduce method for out array
     .reduce((arr, elem) => arr.concat(elem.result), [])
     .find((member: Member) => member.username === username);

     if(member) {
       return of(member);
     }


    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
updateMember(member: Member){
  // return this.http.put(this.baseUrl+ 'users', member); // member after the comma, is the member that we want to pass
  return this.http.put(this.baseUrl+ 'users/', member).pipe(
    map(() => {
      const index = this.members.indexOf(member);
      this.members[index] = member;
    })
  )
}
setMainPhoto(photoId: number) {
  return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {}); // {what we are sending}
}
deletePhoto(photoId: number) {
  return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId )
}


addLike(username: string){
  return this.http.post(this.baseUrl+ 'likes/'+username, {}); //Because it is a post , we need to add {} -> empty body
}


getLikes(predicate: string){
  return this.http.get<Partial<Member[]>>(this.baseUrl + 'likes?predicate='+predicate);
}

private getPaginatedResult<T>(url : string, params : any) {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
   return this.http.get<T>(url, { observe: 'response', params }).pipe(

     map(response => {
       paginatedResult.result = response.body!;
       if (response.headers.get('Pagination') !== null) {
         paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
       }
       return paginatedResult;
     })

   );
 }

 //private method to get the info about the member and info about pagination
 // We are doing this because we have to much information in one method and it is hard to understand
 private getPaginationHeaders(pageNumber: number, pageSize: number){
   let params = new HttpParams();
   
     params = params.append('pageNumber', pageNumber.toString());
     params = params.append('pageSize', pageSize.toString());

   return params;
 }


}



