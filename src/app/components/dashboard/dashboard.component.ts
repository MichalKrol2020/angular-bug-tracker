import { Component, OnInit } from '@angular/core';
import {TalkService} from "../../service/talk.service";
import {SideNavToggle} from "../../model/side-nav-toggle";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit
{
  isSideNavCollapsed = false;
  screenWidth = 0;

  constructor(private talkService: TalkService)
  {}

  ngOnInit(): void
  {
    this.talkService.createCurrentSession();
  }


  onToggleSideNav(data: SideNavToggle): void
  {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}


