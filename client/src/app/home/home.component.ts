import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  constructor() { }

  ngOnInit(): void {
  }

  registerToggle(){
    this.registerMode = !this.registerMode;
  }
/*
  getUsers(){
                                                  // in subscribe , first users =? what we get back from the call of out api
                                                  // after => this.users , are the users that we declare a bit upper , 
                                                  // and this.users we want to be equal to the users that we get from our api 
    this.http.get('http://localhost:5000/api/users').subscribe(users => this.users = users);
  }
*/
  cancelRegisterMode(event: boolean){
    this.registerMode = event;
  }
}
