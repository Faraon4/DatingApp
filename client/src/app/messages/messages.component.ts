import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages!: Message[];
  pagination!: Pagination;
  container = 'Outbox';
  pageNumber = 1;
  pageSize = 5;
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response => {
      this.messages = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event:any){
    // We need here to double check, because we get get the bug of infite time loading the page
    
    if(this.pageNumber !== event.page)
    {
    this.pageNumber = event.page;
    this.loadMessages();
    }
  }
}
