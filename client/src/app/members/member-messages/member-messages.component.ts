import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  // We need to clear the form after we send the message
  // and for this we will use the @ViewChild
  @ViewChild('messageForm') meesageForm!: NgForm;


  @Input() messages!: Message[];
  @Input() username!:string; // we get this from member-detail compoent;
  messageContent!: string;

  constructor(private messageSevice: MessageService) { }

  ngOnInit(): void {
  }

  sendMessage(){
    this.messageSevice.sendMessage(this.username, this.messageContent).subscribe(message => {
      this.messages.push(message);

      // when we subscribe, we write (message => because we know that we
      // will get back the message


      // This line of code reset the form 
      this.meesageForm.reset();
    })
  }




}
