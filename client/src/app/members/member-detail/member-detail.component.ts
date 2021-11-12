import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs!: TabsetComponent;
  member!: Member;
  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];
  activeTab!: TabDirective;
  messages: Message[] = [];

  
  constructor(private memberService: MembersService, private route: ActivatedRoute, private messageService: MessageService) { }
  ngOnInit(): void {

    // we ensure that router do it automatically
    this.route.data.subscribe(data => {
      this.member = data.member;
    })

    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4 , // will display 4 photo in the row
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false // we cannot click on the image
      }
    ]

    
    this.galleryImages = this.getImages(); // initialize our galery 
  }

  // method to get the photoes outside the members
  getImages(): NgxGalleryImage[]{
    const imageUrls = [];
    for(const photo of this.member.photos){
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrls;
  }




  // We do not need this method anymore because we create the resolver
  // and we as well subscribe in the ngOnInit() method
  // AAAAAAnn the initialization of the galary we add as well in the Oninit
  /*
  loadMember(){
    this.memberService.getMember(this.route.snapshot.paramMap.get('username')!).subscribe(member => {
      this.member = member;
      // add this line here, because 
      // we ensure that we have the user and then we load the photos
      // because if we put this line in ngOnInit
      // we will get an error in the console, because nothing is waiting for nothing
      // but in this way we ensure the app that aeverything is ok
      

      
      this.galleryImages = this.getImages(); // initialize our galery 
    })
  }

  */


  loadMessages(){
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    })
  }
  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages' && this.messages.length === 0){
      this.loadMessages();
    }
  }

  // We create this method and it will do next:
  // When we will press the green MessageButoon from the card
  // we want to activate the message tab
  // and because we are not doinf nothing dynamicly with our tabs
  // we hardcoded in the html part, 
  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;

  }

}