import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating App';
  users: any;
  constructor(private http: HttpClient, private accountService : AccountService){

  }
  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
   const user: User = JSON.parse(localStorage.getItem('user') || '{}');
   this.accountService.setCurrentUser(user);
  }

 
  /* We do not need more this method here, instead , we will use it in the home component
// instead of writing the method inside the ngOnInit -> we can create a separate method down of it and then just call the method from ngOnInit
  getUsers(){
    this.http.get('http://localhost:5000/api/users').subscribe(response => {
      this.users = response;
    }, error =>{
      console.log(error);
    } )
  }
*/

}
