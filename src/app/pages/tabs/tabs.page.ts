import {Component, NgZone, OnInit} from '@angular/core';
import {AppCacheService} from "../../services/storage.service";
import {MessagesService} from "../../services/messages.service";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  unreadCount: number = 0;

  roleApp;

  constructor(
      private storageService: AppCacheService,
      private messagesService: MessagesService,
      private ngZone: NgZone
  ) { }

  async ngOnInit() {
    this.roleApp = await this.storageService.get('roleApp');
    this.messagesService._unreadMessages.subscribe((unread)=>{
        this.ngZone.run(()=>this.unreadCount = unread.length);
    });

  }

}
