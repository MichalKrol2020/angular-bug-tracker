import {Component, NgZone, OnInit} from '@angular/core';
import {BugService} from "../../service/bug.service";
import {BugStatusEnum} from "../../enum/bug-status.enum";
import {AuthenticationService} from "../../service/authentication.service";
import {dropdown} from "../../const/animations";
import {PdfService} from "../../service/pdf.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css'],
  animations: [dropdown]
})
export class CockpitComponent implements OnInit
{
  public bugsCount: number | undefined;
  public bugsCountThisMonth: number | undefined;
  public bugsCountByStatus: number | undefined;
  private readonly currentUserId: number;
  public readonly isProjectLeader: boolean;
  public readonly isUser: boolean;

  private subscriptions: Subscription[] = [];

  constructor(private zone: NgZone,
              private pdfService: PdfService,
              private bugService: BugService,
              private authenticationService: AuthenticationService)
  {
    this.isProjectLeader = this.authenticationService.isProjectLeader();
    this.isUser = this.authenticationService.isUser();
    this.currentUserId = this.authenticationService.getUserFromLocalCache().id;
  }

  ngOnInit(): void
  {
    this.setBugCount();
  }

  private setBugCount()
  {
    const daysAgo = 30;
    if(this.isProjectLeader)
    {
      this.setCountsByProjectLeader(BugStatusEnum.FIXED, daysAgo);
    } else
    {
      this.setCountsByUser(BugStatusEnum.FIXED, daysAgo);
    }
  }

  private setCountsByProjectLeader(status: string, daysAgo: number)
  {
    this.subscriptions.push(
      this.bugService.getCountByProjectLeader(this.currentUserId).subscribe
      ((response) =>
      {
        this.bugsCount = response;
      }),

      this.bugService.getCountByProjectLeaderIdAndStatus(this.currentUserId, status).subscribe
      ((response) =>
      {
        this.bugsCountByStatus = response;
      }),

      this.bugService.getCountByProjectLeaderAndAddedAfter(this.currentUserId, daysAgo).subscribe
      ((response) =>
      {
        this.bugsCountThisMonth = response;
      }));
  }

  private setCountsByUser(status: string, daysAgo: number)
  {
    this.subscriptions.push(
      this.bugService.getCountByCreator(this.currentUserId).subscribe
      ((response) =>
      {
        this.bugsCount = response
      }),

      this.bugService.getCountByAssigneeAndStatus(this.currentUserId, status).subscribe
      ((response) =>
      {
        this.bugsCountByStatus = response
      }),

      this.bugService.getCountByCreatorAndAddedAfter(this.currentUserId, daysAgo).subscribe
      ((response) =>
      {
        this.bugsCountThisMonth = response
      }));
  }

  downloadReport()
  {
    this.pdfService.downloadPdf(this.currentUserId);
  }

  ngOnDestroy()
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

