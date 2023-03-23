import {Component, EventEmitter, HostListener, NgZone, OnInit} from '@angular/core';
import {Project} from "../../model/project";
import {AuthenticationService} from "../../service/authentication.service";
import {ProjectService} from "../../service/project.service";
import {tableProjectsData} from "../../const/table-headers-data";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {tableProjectsModsSelectData} from "../../const/table-projects-mods-select-data";
import {CreateProjectComponent} from "../create-project/create-project.component";
import {DialogUtils} from "../../utils/dialog-utils";
import {NotificationService} from "../../service/notification.service";
import {PageUtils} from "../../utils/page-utils";
import {Subscription} from "rxjs";
import {ProjectsModEnum} from "../../enum/projects-mod-enum";
import {ProjectPageableResponse} from "../../model/project-pageable-response";

const DEFAULT_SORT_ORDER = 'name';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit
{
  public modSelectedChangedEvent: EventEmitter<string> = new EventEmitter<string>();
  public readonly isProjectLeader: boolean = false;

  public readonly tableData = tableProjectsData;
  public readonly tableProjectsMods = tableProjectsModsSelectData;

  public projects: Project[] = [];
  public page = 1;
  public size: number = 5;
  private readonly minSize: number = 3;
  public totalElements: number = 0;

  private sortOrder: string = DEFAULT_SORT_ORDER;
  private ascending: boolean = true;

  public modSelected: string = ProjectsModEnum.ISSUES;

  private currentPageHeight: number;
  private readonly pageDivider: number = 110;

  private subscriptions: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private projectService: ProjectService,
              private dialog: MatDialog,
              private zone: NgZone)
  {
    this.isProjectLeader = this.authenticationService.isProjectLeader();
    this.currentPageHeight = window.innerHeight;
  }

  ngOnInit(): void
  {
    this.size = PageUtils.calculatePageSize(this.pageDivider, this.minSize);
    this.listProjects();
  }


  listProjects(): void
  {
    const currentAppUserId = this.authenticationService.getUserFromLocalCache().id;
    if(this.authenticationService.isProjectLeader())
    {
      this.subscriptions.push(
      this.projectService.getProjectsByProjectLeaderId(currentAppUserId, this.page - 1, this.size, this.sortOrder, this.ascending).subscribe
      (this.processResponse()));
    } else
    {
      this.subscriptions.push(
      this.projectService.getProjectsByParticipantId(currentAppUserId, this.page - 1, this.size, this.sortOrder, this.ascending).subscribe
      (this.processResponse()));
    }
  }


  private processResponse()
  {
    return (data: ProjectPageableResponse) =>
    {
      this.projects = data.content;
      this.page = data.pageable.pageNumber + 1;
      this.size = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    }
  }


  onChangeSortOrder(sortOrder: string): void
  {
    if(this.sortOrder != sortOrder)
    {
      this.sortOrder = sortOrder;
      this.ascending = true;
    } else
    {
      this.ascending = !this.ascending;
    }

    this.listProjects();
  }


  openCreateProjectDialog(): void
  {
    const dialogConfig = DialogUtils.createBasicConfig(350, 655);
    const dialogRef = DialogUtils.openDialog(this.zone, this.dialog, dialogConfig, CreateProjectComponent);
    this.listProjectsIfDialogConfirmed(dialogRef);
  }

  private listProjectsIfDialogConfirmed(dialogRef: MatDialogRef<CreateProjectComponent>): void
  {
    this.subscriptions.push(
    dialogRef.afterClosed().subscribe((confirmed: boolean) =>
    {
      if(confirmed)
      {
        this.listProjects();
      }
    }));
  }

  @HostListener('window:resize', ['$event'])
  private onResize(): void
  {
    const countedSize = PageUtils.calculatePageSizeWithPrevention
    (this.currentPageHeight, window.innerHeight, this.pageDivider, this.minSize, this.size);
    if(countedSize == -1)
    {
      return;
    }

    this.setPageData(countedSize);
    this.listProjects();
  }

  private setPageData(countedSize: number): void
  {
    this.size = countedSize;
    this.currentPageHeight = window.innerHeight;
    this.page = 1;
  }

  onModChange(): void
  {
    this.modSelectedChangedEvent.emit(this.modSelected);
  }

  onReloadProjectsRequested(): void
  {
    this.modSelected = ProjectsModEnum.ISSUES;
    this.listProjects();
  }


  getTableHeaderClass(item: any): string
  {
    return 'headers-row' + (this.tableData.indexOf(item) == 0 ? '-first' : '');
  }


  ngOnDestroy(): void
  {
    this.subscriptions.forEach
    ((subscription) => subscription.unsubscribe());
  }
}

