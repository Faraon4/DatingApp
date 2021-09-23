import { Component, OnInit } from '@angular/core';
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

  constructor(public accountService : AccountService) { }

  ngOnInit(): void {
  }

  login() {
   // console.log(this.model);
   this.accountService.login(this.model).subscribe(response => {
     console.log(response);
   }, error => {
     console.log(error);
   })
  }


  logout(){
    this.accountService.logout();
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
