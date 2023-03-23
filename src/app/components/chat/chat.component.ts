import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {TalkService} from "../../service/talk.service";
import Talk from "talkjs";
import {User} from "../../model/user";
import {mergeMap, Subscription} from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit
{
  private chatPopup!: Talk.Popup;

  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService,
              private talkService: TalkService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void
  {
    this.handlePopupChat();
  }


  private handlePopupChat()
  {
    if(!this.route.snapshot.paramMap.has('id') )
    {
      return;
    }

    this.subscriptions.push(
    this.route.params.pipe(mergeMap(response =>
    {
      if(this.chatPopup)
      {
        this.chatPopup.destroy();
      }

      const userId = +response['id'];
      return this.userService.getUserById(userId);
    })).subscribe((response) => this.preloadChatPopup(response)));
  }




  private async preloadChatPopup(otherAppUser: User)
  {
    const chatPopup = await this.talkService.createPopup(otherAppUser, true);
    this.chatPopup = chatPopup;

    await chatPopup.mount({show: true});
  }



  ngOnDestroy()
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
