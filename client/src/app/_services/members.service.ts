import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';



@Injectable({
  providedIn: 'root'
})
export class MembersService {
baseUrl = environment.apiUrl;
members: Member[] = [];
paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

  constructor(private http: HttpClient) { }

  getMembers(userParams: UserParams){


   let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
   params = params.append('minAge', userParams.minAge.toString());
   params = params.append('maxAge', userParams.maxAge.toString());
   params = params.append('gender', userParams.gender);
   
   return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params)
  }




  getMember(username:string){
    const member = this.members.find(x => x.username === username);
    if(member !== undefined) return of(member);
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



