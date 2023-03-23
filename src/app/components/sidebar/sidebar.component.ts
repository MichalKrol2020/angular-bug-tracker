import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core';
import {navbarData} from "../../const/nav-data";
import {fadeInOut, rotate} from "../../const/animations";

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
  onResize()
  {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768)
    {
      this.isSideNavCollapsed = true;
      this.onToggleSideNav.emit({collapsed: this.isSideNavCollapsed, screenWidth: this.screenWidth})
    }
  }

  onCollapseSidenav()
  {
    this.isSideNavCollapsed = !this.isSideNavCollapsed;
    if(this.isChatListExpanded)
    {
      this.isChatListExpanded = false;
    }

    this.emitOnToggleSideNav()
  }

  onCloseSidenav()
  {
    this.isSideNavCollapsed = true;
    this.isChatListExpanded = false;

    this.emitOnToggleSideNav();
  }

  onExpandChatList()
  {
    if(this.isSideNavCollapsed)
    {
      this.isSideNavCollapsed = !this.isSideNavCollapsed;
    }
    this.isChatListExpanded = !this.isChatListExpanded;

    this.emitOnToggleSideNav();
  }

  private emitOnToggleSideNav()
  {
    this.onToggleSideNav.emit
    ({
      collapsed: this.isSideNavCollapsed,
      screenWidth: this.screenWidth
    });
  }

}

interface SideNavToggle
{
  screenWidth: number;
  collapsed: boolean;
}
