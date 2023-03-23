import {Component, Input, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {navbarData} from "../../const/nav-data";
import {filter, Subscription} from "rxjs";
import {fadeInOut} from "../../const/animations";

@Component({
  selector: 'app-page-body',
  templateUrl: './sidebar-body.component.html',
  styleUrls: ['./sidebar-body.component.css'],
  animations: [fadeInOut]
})
export class PageBodyComponent implements OnInit
{
  @Input() isSideNavCollapsed = false;
  @Input() screenWidth = 0;

  public category: string = '';
  public description: string = '';

  private subscriptions: Subscription[] = [];

  constructor(private router: Router)
  {
    this.getCategoryFromUrl();
  }

  ngOnInit(): void
  {}


  getBodyClass()
  {
    if(!this.isSideNavCollapsed && this.screenWidth > 768 && window.innerWidth > 1600)
    {
      return 'body-trimmed';
    }

    if (!this.isSideNavCollapsed && this.screenWidth < 768 && this.screenWidth > 0)
    {
      return 'body-md-screen';
    }

    return '';
  }

  private getCategoryFromUrl()
  {
    this.subscriptions.push(
    this.router.events.pipe
    (filter(event => event instanceof NavigationEnd)).subscribe
    (() => {
      this.setCategoryAndDescription();
    }));
  }

  private setCategoryAndDescription()
  {
    let containsCategory: boolean = false;
    navbarData.forEach((navItem) =>
    {
      if(this.router.url.includes(navItem.routerLink))
      {
        this.category = navItem.label;
        this.description = navItem.description;
        containsCategory = true;
      }
    });

    if(!containsCategory)
    {
      this.category = '';
      this.description = '';
    }
  }

  ngOnDestroy()
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
