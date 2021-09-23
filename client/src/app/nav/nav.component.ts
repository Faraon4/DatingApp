import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model : any = {} // what user will imput we will store here

  constructor(public accountService : AccountService, private router : Router, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login() {
   // console.log(this.model);
   this.accountService.login(this.model).subscribe(response => {
     this.router.navigateByUrl('/members'); // when we login to send us to the members page automaticaly
   }, error => {
     console.log(error);
     this.toastr.error(error.error);
   })
  }


  logout(){
    this.accountService.logout(); // to logout 
    this.router.navigateByUrl('/'); // to send us back to the home page
  }

  /*
 getCurrentUser() {
   this.accountService.currentUser$.subscribe(user => { // user show that our object at the moment being here, contains an user object
    this.loggedIn = !!user; // !! turn object to boolean -> if user is null that it is false 
   }, error => {
     console.log(error);
   })
 } 
 */
}
