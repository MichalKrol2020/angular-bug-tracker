import {Component, HostListener, NgZone, OnInit} from '@angular/core';
import {Bug} from "../../model/bug";
import {BugService} from "../../service/bug.service";
import {AuthenticationService} from "../../service/authentication.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EditIssueComponent} from "../edit-issue/edit-issue.component";
import {tableIssuesModsSelectData} from "../../const/table-issues-mod";
import {SetBugStatusComponent} from "../set-bug-status/set-bug-status.component";
import {BugStatusEnum} from "../../enum/bug-status.enum";
import {inOut} from "../../const/animations";
import {
  tableAddedIssuesData,
  tableAssignedIssuesData,
  tableProjectLeaderIssuesData
} from "../../const/table-headers-data";
import {DialogUtils} from "../../utils/dialog-utils";
import {BugsModEnum} from "../../enum/bugs-mod-enum";
import {AssignUserBugComponent} from "../assign-user-bug/assign-user-bug.component";
import {mergeMap, of, Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationService} from "../../service/notification.service";
import {NotificationType} from "../../enum/notification-type.enum";
import {PageUtils} from "../../utils/page-utils";
import {DateUtils} from "../../utils/date-utils";
import {ComponentType} from "@angular/cdk/overlay";
import {CustomHttpResponse} from "../../model/custom-http-response";
import {BugPageableResponse} from "../../model/bug-pageable-response";
import {BugSortOrderEnum} from "../../enum/bug-sort-order-enum";
import {TableData} from "../../model/table-data";
import {BugEnumMapper} from "../../enum/mapper/bug-enum-mapper";
import {
  ASSIGN_BUG_DIALOG_HEIGHT,
  ASSIGN_BUG_DIALOG_WIDTH, BUG_STATUS_DIALOG_HEIGHT,
  BUG_STATUS_DIALOG_WIDTH, EDIT_BUG_DIALOG_HEIGHT,
  EDIT_BUG_DIALOG_WIDTH
} from "../../const/dialog-const";
import {WarningDialogComponent} from "../warning-dialog/warning-dialog.component";

@Component({
  selector: 'app-issues',
  templateUrl: './bugs.component.html',
  styleUrls: ['./bugs.component.css'],
  animations: [inOut]
})
export class BugsComponent implements OnInit
{
  public tableData: TableData[] = [];
  public tableIssuesMods = tableIssuesModsSelectData;
  public modSelected: string | undefined;

  public isUser: boolean = false;
  public isProjectLeader: boolean;
  private currentUserId: number;

  public bugs: Bug[] = [];
  public page = 1;
  public size: number = 5;
  private readonly minSize: number = 5;
  public totalElements: number = 0;

  private orderBy: string = BugSortOrderEnum.CREATION_DATE;
  private isAscending: boolean = false;

  private currentPageHeight: number;
  private readonly divider: number = 110;

  private subscriptions: Subscription[] = [];

  public readonly modAddedIssues = BugsModEnum.ADDED_ISSUES;
  public readonly bugStatusNew = BugStatusEnum.NEW;

  constructor(private bugService: BugService,
              private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private dialog: MatDialog,
              private zone: NgZone)
  {
    this.isProjectLeader = this.authenticationService.isProjectLeader();
    this.currentUserId = this.authenticationService.getUserFromLocalCache().id;
    this.size = PageUtils.calculatePageSize(this.divider, this.minSize);
    this.currentPageHeight = window.innerHeight;
    this.isUser = this.authenticationService.isUser();
    this.isUser ? this.modSelected = BugsModEnum.ADDED_ISSUES : undefined;
  }


  ngOnInit(): void
  {
    this.tableData = this.getTableData();
    this.listBugs();
  }


  onModChange(): void
  {
    this.tableData = this.getTableData();
    this.page = 1;
    this.listBugs();
  }


  listBugs(): void
  {
    if(this.isProjectLeader)
    {
      this.listBugsByProjectLeader();
    } else
    {
      this.listBugsByModSelected();
    }
  }


  private listBugsByProjectLeader(): void
  {
    this.subscriptions.push(
      this.bugService.getBugsByProjectLeaderId(this.currentUserId, this.page - 1, this.size, this.orderBy, this.isAscending).subscribe
      (this.processResult()));
  }


  private listBugsByModSelected(): void
  {
    if(this.modSelected == BugsModEnum.ADDED_ISSUES)
    {
      this.subscriptions.push(
        this.bugService.getBugsByCreatorId(this.currentUserId, this.page - 1, this.size, this.orderBy, this.isAscending).subscribe
        (this.processResult()));
      return;
    }

    if(this.modSelected == BugsModEnum.ASSIGNED_ISSUES)
    {
      this.subscriptions.push(
        this.bugService.getBugsByAssigneeId(this.currentUserId, this.page - 1, this.size, this.orderBy, this.isAscending).subscribe
        (this.processResult()));
      return;
    }
  }



  private getTableData()
  {
    if(this.isProjectLeader)
    {
      return tableProjectLeaderIssuesData;
    }

    if(this.modSelected == BugsModEnum.ASSIGNED_ISSUES)
    {
      return  tableAssignedIssuesData;
    }

    if(this.modSelected == BugsModEnum.ADDED_ISSUES)
    {
      return tableAddedIssuesData;
    }

    return [];
  }



  showEditButton(bug: Bug): boolean
  {
    if(this.modSelected == BugsModEnum.ASSIGNED_ISSUES)
    {
      return true;
    }

    if(this.isProjectLeader)
    {
      return true;
    }

    if(this.modSelected == BugsModEnum.ADDED_ISSUES)
    {
      if(BugEnumMapper.mapStatusToEnumName(bug.status) == BugStatusEnum.NEW)
      {
        return true;
      }
    }

    return false;
  }



  openUpdateDialog(currentBug: Bug): void
  {
    if(this.modSelected == BugsModEnum.ADDED_ISSUES || this.isProjectLeader)
    {
      this.openDialogWithContent(currentBug, EditIssueComponent, EDIT_BUG_DIALOG_WIDTH, EDIT_BUG_DIALOG_HEIGHT);
    } else if(this.modSelected == BugsModEnum.ASSIGNED_ISSUES)
    {
      this.openDialogWithContent(currentBug, SetBugStatusComponent, BUG_STATUS_DIALOG_WIDTH, BUG_STATUS_DIALOG_HEIGHT);
    }
  }

  openAssignUserDialog(currentBug: Bug): void
  {
    this.openDialogWithContent(currentBug, AssignUserBugComponent, ASSIGN_BUG_DIALOG_WIDTH, ASSIGN_BUG_DIALOG_HEIGHT);
  }

  private openDialogWithContent(currentBug: Bug, component: ComponentType<any>, width: number, height: number)
  {
    const dialogConfig = DialogUtils.createDialogConfig(width, height, currentBug);
    DialogUtils.openDialog(this.zone, this.dialog, dialogConfig, component);
  }



  onUnassignWorkerFromBug(bug: Bug): void
  {
    const dialogRef = this.openUnassignDialog(bug)

    this.subscriptions.push(
    dialogRef.afterClosed().pipe(mergeMap((confirmed) =>
    {
      if(confirmed)
      {
        return this.bugService.unassignWorkerFromBug(bug.id);
      }

      return of(undefined);
    })).subscribe(
      {
        next: this.onUnassignDialogClosed(bug),
        error: this.onError()
      }));
  }


  private openUnassignDialog(bug: Bug): MatDialogRef<WarningDialogComponent>
  {
    const assignee = bug.assignee;
    const title = 'Do you want to unassign this worker?';
    const description = `You are trying to unassign: ${assignee?.firstName} ${assignee?.lastName} ` +
                        `from: ${bug.name}. ` +
                        'This cannot be undone!';
    const buttonText = 'Confirm';
    const dialogData = DialogUtils.createWarningDialogData(title, description, buttonText);

    return DialogUtils.openWarningDialog(dialogData, this.zone, this.dialog);
  }

  private onUnassignDialogClosed(bug: Bug)
  {
    return (response: CustomHttpResponse | undefined) =>
    {
      if(response)
      {
        this.onWorkerUnassignedSuccessfully(bug, response);
      }
    }
  }

  private onWorkerUnassignedSuccessfully(bug: Bug, response: CustomHttpResponse): void
  {
    bug.assignee = undefined;
    this.notificationService.notify(NotificationType.SUCCESS, response.message);
  }



  onDeleteBug(bug: Bug): void
  {
    const dialogRef = this.openDeleteBugDialog(bug);

    this.subscriptions.push(
    dialogRef.afterClosed().pipe(mergeMap((confirmed) =>
    {
      if(confirmed)
      {
        return this.bugService.deleteBug(bug.id, this.currentUserId);
      }

      return of(undefined);
    })).subscribe(
      {
        next: this.onDeleteBugDialogClosed(),
        error: this.onError()
      }));
  }

  private openDeleteBugDialog(bug: Bug): MatDialogRef<WarningDialogComponent>
  {
    const title = 'Do you want to delete this issue?';
    const description = `You are trying to delete issue: ${bug.name}.\n` +
      '    This cannot be undone!';
    const buttonText = 'Delete';
    const dialogData = DialogUtils.createWarningDialogData(title, description, buttonText);

    return  DialogUtils.openWarningDialog(dialogData, this.zone, this.dialog);
  }

  private onDeleteBugDialogClosed()
  {
    return (response: CustomHttpResponse | undefined) =>
    {
      if(response)
      {
        this.onBugDeletedSuccessfully(response);
      }
    }
  }

  private onBugDeletedSuccessfully(response: CustomHttpResponse): void
  {
    this.listBugs();
    this.notificationService.sendSuccessNotification(response.message);
  }


  private onError()
  {
    return (errorResponse: HttpErrorResponse) =>
    {
      this.notificationService.sendErrorNotification(errorResponse.error.message);
    }
  }

  onChangeSortOrder(orderBy: string): void
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


  onBugExpand(bug: Bug): void
  {
    bug.expanded = !bug.expanded;
  }


  getDayMonthYear(date: Date): string
  {
    return DateUtils.getDayMonthYear(date);
  }


  getAssigneeName(bug: Bug): string
  {
    const assignee = bug.assignee;
    return !assignee ? 'Not assigned' : assignee.firstName + ' ' + assignee.lastName;
  }

  @HostListener('window:resize', ['$event'])
  private onResize(): void
  {
    const countedSize = PageUtils.calculatePageSizeWithPrevention
    (this.currentPageHeight, window.innerHeight, this.divider, this.minSize, this.size);
    if(countedSize == -1)
    {
      return;
    }

    this.setPageData(countedSize);
    this.listBugs();
  }

  private setPageData(countedSize: number): void
  {
    this.size = countedSize;
    this.currentPageHeight = window.innerHeight;
    this.page = 1;
  }


  getSeverityClass(severity: String): string
  {
    return 'severity-' + severity.toLowerCase();
  }

  getMenuClass(): string
  {
    return this.isProjectLeader ? 'menu-long' : '';
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

  ngOnDestroy(): void
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}



