import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
  @ViewChild('editForm') editForm!: NgForm;
  member!: Member;
  user!: User;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private accountService : AccountService, private memberService: MembersService, private toasts: ToastrService) { 
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
    console.log(this.user.username);
    console.log(member);
  });
}

updateMember(){
  this.memberService.updateMember(this.member).subscribe(() => {
    this.toasts.success("Profile Updated Succefuly");
  this.editForm.reset(this.member); // this is the updated user after we submit our form
  })
}
}

// Write the correct code to get the member
// First of all we need to display the user, if it is a member
// and for this we are takeing out of observables the user that we get 
// and then we do wha we do in this file