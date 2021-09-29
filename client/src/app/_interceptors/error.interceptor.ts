import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {} // We use router, because in case of error we want to redirect user to specific page

  // we need to provide it in app-module because it is an interceptor
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if( error){
          switch (error.status) {
            case 400:
                if(error.error.erros) {
                  const modalStateErrors = [];
                  for(const key in error.error.errors) {
                    if (error.error.errors[key]) {
                      modalStateErrors.push(error.error.errors[key]);
                    }
                  }

                  throw modalStateErrors;
                }
                else {
                  this.toastr.error(error.statusText, error.status);
                }
              break;
            case 401: 
                this.toastr.error(error.statusText, error.status);
                break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;

            case 500:
              const navigationExtras: NavigationExtras = {state: {error: error.error}}
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;

            default:
              this.toastr.error('Something unexpected goes wrong');
              console.log(error);
              break;
          }
        }
        return throwError(error);
      })
    )
  }
}
