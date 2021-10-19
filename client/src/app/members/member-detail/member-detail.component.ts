import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member!: Member;
  galleryOptions!: NgxGalleryOptions[];
  galleryImages!: NgxGalleryImage[];
  constructor(private memberService: MembersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();

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

 //  this.galleryImages = this.getImages(); // initialize our galery
  }

  // method to get the photos outside the members
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

}