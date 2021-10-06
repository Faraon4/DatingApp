import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  member!: Member;
  user!: User;

  constructor(private accountService : AccountService, private memberService: MembersService) { 
    // User (from service) is an observable, and we cannot really work with observables in compoenent
    // FOr this we need to take it off from the observables and populate our user that we declare upper

    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);

  }

  ngOnInit(): void {
    this.loadMember();
  }

loadMember() {
  this.memberService.getMember(this.user.username).subscribe(member => {
    this.member = member;
  });
}

}
