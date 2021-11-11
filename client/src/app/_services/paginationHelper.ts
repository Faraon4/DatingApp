import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../_models/pagination";

export function  getPaginatedResult<T>(url : string, params : any, http : HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
     return http.get<T>(url, { observe: 'response', params }).pipe(
  
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
   export function getPaginationHeaders(pageNumber: number, pageSize: number){
     let params = new HttpParams();
     
       params = params.append('pageNumber', pageNumber.toString());
       params = params.append('pageSize', pageSize.toString());
  
     return params;
   }