import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

 // members$!: Observable<Member[]>;
 members: Member[] = [];
 pagination!: Pagination;
 userParams!: UserParams;
 user! : User;
 genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  constructor(private memberService: MembersService) {
    // Now we will inject the userParams from our memberService
    // With the help of our 2 new method
    // getUserParams and setUserParams
    this.userParams = this.memberService.getUserParams();
   }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();

  }

  pageChanged(event : any){
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
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