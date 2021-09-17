import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating App';
  users: any;
  constructor(private http: HttpClient){

  }
  ngOnInit() {
    this.getUsers();


   /* this.http.get('https://localhost:5001/api/users').subscribe(response => {P
      this.users = response;
    }, error =>{
      console.log(error);
    } ) */
  }

// instead of writing the method inside the ngOnInit -> we can create a separate method down of it and then just call the method from ngOnInit
  getUsers(){
    this.http.get('http://localhost:5000/api/users').subscribe(response => {
      this.users = response;
    }, error =>{
      console.log(error);
    } )
  }


}
