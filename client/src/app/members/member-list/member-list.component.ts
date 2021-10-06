import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  members$!: Observable<Member[]>;
  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
   // this.loadMembers();
   this.members$ = this.memberService.getMembers();
  }

  //We do not need this more, because we will take it from our service, but in our service we implemenet , that we don't make an API call all the time
  /*
    loadMembers() {
      //subscribe because it is observable, and members => is the response that we get and in the {we specify what we want to di with this}
      this.memberService.getMembers().subscribe(members => {
        this.members = members;
      })
    }

    */
}
