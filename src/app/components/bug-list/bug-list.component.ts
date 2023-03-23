import {BugService} from "../../service/bug.service";
import {NotificationService} from "../../service/notification.service";

import {Bug} from "../../model/bug";
import {Project} from "../../model/project";

import {BugPageableResponse} from "../../model/bug-pageable-response";
import {BugTableData} from "../../model/bug-table-data";
import {BugSortOrderEnum} from "../../enum/bug-sort-order-enum";
import {Component, Input, OnInit} from '@angular/core';
import {DateUtils} from "../../utils/date-utils";
import {inOut} from "../../const/animations";
import {Observable, Subscription} from "rxjs";
import {tableIssuesListData} from "../../const/table-headers-data";


@Component({
  selector: 'app-bug-list',
  templateUrl: './bug-list.component.html',
  styleUrls: ['./bug-list.component.css'],
  animations: [inOut]
})
export class BugListComponent implements OnInit
{
  @Input() project: Project | undefined;
  @Input() projectExpanded$: Observable<boolean> = new Observable<boolean>();

  public isProjectExpanded: boolean = false;

  public readonly tableData = tableIssuesListData;

  public bugs: Bug[] = [];
  public page: number = 1;
  public size: number = 5;
  public totalElements: number = 0;

  private orderBy: string = BugSortOrderEnum.CREATION_DATE;
  private isAscending: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(private bugService: BugService,
              private notificationService: NotificationService)
  {}

  public ngOnInit(): void
  {
    this.onProjectExpanded();
    this.listBugs();
  }

  private onProjectExpanded(): void
  {
    this.subscriptions.push(
    this.projectExpanded$.subscribe((response: boolean) =>
    {
      this.isProjectExpanded = response;
    }));
  }


  public listBugs(): void
  {
    if(!this.project)
    {
      this.notificationService.notifyAboutError();
      return;
    }

    this.subscriptions.push(
    this.bugService.getBugsByProject(this.project.id, this.page - 1, this.size, this.orderBy, this.isAscending).subscribe
    (this.processResult()));
  }


  public getSeverityClass(severity: String): string
  {
    return 'severity-' + severity.toLowerCase();
  }


  public getDate(date: Date): string
  {
    return DateUtils.getDayMonthYear(date);
  }


  public onChangeSortOrder(orderBy: string): void
  {
    if(this.orderBy != orderBy)
    {
      this.orderBy = orderBy;
      this.isAscending = true;
    } else
    {
      this.isAscending = !this.isAscending;
    }

    this.listBugs();
  }

  public getTableHeaderClass(item: BugTableData): string
  {
    return this.tableData.indexOf(item) == 0 ? 'headers-column-first' : '';
  }

  private processResult()
  {
    return (data: BugPageableResponse) =>
    {
      this.bugs = data.content;
      this.page = data.pageable.pageNumber + 1;
      this.size = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    }
  }

  public ngOnDestroy(): void
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}



