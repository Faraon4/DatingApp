import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  // method to go and get the messages
  getMessages(pageNumber: number, pageSize: number, container:any) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container',container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages',params,this.http);
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/'+username);
}

//username, is the person to whom we want to send a message
sendMessage(username:string, content : string){
  // {} in the breacket we show what we want to send
  // and then we specify the name of parameters (key)
  // recipientUsername : username
  // content stay like this , because the name of the property is the same what we pass in

  return this.http.post<Message>(this.baseUrl+ 'messages', {recipientUsername: username, content});
}


deleteMessage(id: number) {
  return this.http.delete(this.baseUrl + 'messages/'+id);
}
}
