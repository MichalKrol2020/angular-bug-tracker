import {Component, OnInit} from '@angular/core';
import Talk from 'talkjs';
import {TalkService} from "../../service/talk.service";
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../../service/user.service";
import {filter, Subscription} from "rxjs";
import {SelectConversationEvent} from "talkjs/all";

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit
{
  public expanded: boolean = false;
  private baseUrl!: string;
  private inbox!: Talk.Inbox;

  private subscriptions: Subscription[] = [];

  constructor(private talkService: TalkService,
              private userService: UserService,
              private router: Router)
  {
    this.setBaseUrl();
  }

  private setBaseUrl(): void
  {
    this.subscriptions.push(
      this.router.events.pipe
      (filter(event => event instanceof NavigationEnd)).subscribe
      (() =>
      {
        let routeParent = this.router.url.split('/chat');
        this.baseUrl = routeParent[0];
      }));
  }

  ngOnInit(): void
  {
    this.openInbox();
  }

  private openInbox(): void
  {
    this.createInbox().then
    (() => this.inbox.onSelectConversation((event: SelectConversationEvent) =>
    {
      this.openConversation(event);
    }));
  }

  private openConversation(event: SelectConversationEvent): void
  {
    if(event.conversation != undefined)
    {
      this.router.navigateByUrl(`${this.baseUrl}/chat/${event.others.at(0)?.id}`)
    }

    event.preventDefault();
  }

  private async createInbox()
  {
    this.inbox = await this.talkService.createInbox();
    await this.inbox.mount(document.getElementById('inbox-container'))
  }

  onExpand(): void
  {
    this.expanded = !this.expanded;
  }

  ngOnDestroy(): void
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
