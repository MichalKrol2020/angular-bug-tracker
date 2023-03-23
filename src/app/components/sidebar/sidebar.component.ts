import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {navbarData} from "../../const/nav-data";
import {fadeInOut, rotate} from "../../const/animations";
import {SideNavToggle} from "../../model/side-nav-toggle";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations:
  [fadeInOut, rotate]
})
export class SidebarComponent implements OnInit
{
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  public isSideNavCollapsed = true;
  public isChatListExpanded = false;
  private screenWidth = 0;
  public readonly navData = navbarData;

  constructor()
  {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void
  {}

  @HostListener('window:resize', ['$event'])
  onResize(): void
  {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768)
    {
      this.isSideNavCollapsed = true;
      this.onToggleSideNav.emit({collapsed: this.isSideNavCollapsed, screenWidth: this.screenWidth})
    }
  }

  onCollapseSidenav(): void
  {
    this.isSideNavCollapsed = !this.isSideNavCollapsed;
    if(this.isChatListExpanded)
    {
      this.isChatListExpanded = false;
    }

    this.emitOnToggleSideNav()
  }

  onCloseSidenav(): void
  {
    this.isSideNavCollapsed = true;
    this.isChatListExpanded = false;

    this.emitOnToggleSideNav();
  }

  onExpandChatList(): void
  {
    if(this.isSideNavCollapsed)
    {
      this.isSideNavCollapsed = !this.isSideNavCollapsed;
    }
    this.isChatListExpanded = !this.isChatListExpanded;

    this.emitOnToggleSideNav();
  }

  private emitOnToggleSideNav(): void
  {
    this.onToggleSideNav.emit
    ({
      collapsed: this.isSideNavCollapsed,
      screenWidth: this.screenWidth
    });
  }
}


