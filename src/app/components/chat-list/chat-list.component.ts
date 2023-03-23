import {Component, HostListener, Input, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {User} from "../../model/user";
import {NavigationEnd, Router} from "@angular/router";
import {filter, Subscription} from "rxjs";
import {dropdown, fadeInOut} from "../../const/animations";
import {FormControl} from "@angular/forms";
import {UserPageableResponse} from "../../model/user-pageable-response";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
  animations: [fadeInOut, dropdown]
})
export class ChatListComponent implements OnInit
{
  @Input() sideNavCollapsed: boolean = false;
  @Input() chatListExpanded: boolean | undefined;

  public searchUserFormControl: FormControl = new FormControl('');

  public route: string = '';

  public users: User[] = [];
  private page: number = 0;
  private readonly size: number = 4;
  private isEndOfPages: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService,
              private router: Router)
  {
    this.onChatLinkRouteChange();
  }

  ngOnInit(): void
  {
    this.listAllUsers();
  }

  private onChatLinkRouteChange()
  {
    this.subscriptions.push(
      this.router.events.pipe
      (filter(event => event instanceof NavigationEnd)).subscribe
      (() => {
        let routeParent = this.router.url.split('/chat');
        this.route = routeParent[0];
      }));
  }

  private listAllUsers()
  {
    this.subscriptions.push(
    this.userService.getUsers(this.page, this.size).subscribe
    (this.processResult()));
  }

  private processResult()
  {
    return (data: UserPageableResponse) =>
    {
      this.users.push(...data.content);
      this.page = data.pageable.pageNumber;
      this.isEndOfPages = this.page >= data.totalPages;
    }
  }

  onSearchUser()
  {
    this.page = 0;
    this.users = [];
    this.isEndOfPages = false;
    this.searchAllUsers();
  }

  private searchAllUsers()
  {
    const fullName = this.searchUserFormControl.value;

    this.subscriptions.push(
    this.userService.getUsersByFullName(fullName, this.page, this.size).subscribe
    (this.processResult()));
  }


  @HostListener('scroll', ['$event'])
  onScroll(event: Event)
  {
    const target = event.target as HTMLElement
    const scrolled =
      target.scrollTop + target.offsetHeight >= target.scrollHeight - 1;

    if(scrolled && !this.isEndOfPages)
    {
      this.page++;
      if(this.searchUserFormControl.value)
      {
        this.searchAllUsers();
      } else
      {
        this.listAllUsers();
      }
    }
  }

  ngOnDestroy()
  {
    this.subscriptions.forEach
    ((subscription) => subscription.unsubscribe());
  }
}
