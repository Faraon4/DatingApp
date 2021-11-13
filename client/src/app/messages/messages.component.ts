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

  messages: Message[] = [];
  pagination!: Pagination;
  container = 'Unread'; // we use this to go to necesary container , when we open the messages
  pageNumber = 1;
  pageSize = 5;
  loading = false;
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response => {
      this.messages = response.result;
      this.pagination = response.pagination;
      this.loading = false;
    })
  }

  // subscribe(()=> ) are empty pharantesys because from the delete we do not
  // get anything , and then we find the index of the message that we want to delete
  // and then 1, show that we want to delete only 1 message with this id
  
  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.messages.splice(this.messages.findIndex(m => m.id == id),1);
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
