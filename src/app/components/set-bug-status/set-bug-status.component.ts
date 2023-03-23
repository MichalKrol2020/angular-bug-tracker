import {Bug} from "../../model/bug";

import {BugService} from "../../service/bug.service";
import {NotificationService} from "../../service/notification.service";

import {BugStatusSelectData} from "../../const/bug-status-select-data";
import {BugEnumMapper} from "../../enum/mapper/bug-enum-mapper";
import {Component, Inject, OnInit} from '@angular/core';
import {CustomHttpResponse} from "../../model/custom-http-response";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotificationType} from "../../enum/notification-type.enum";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-set-bug-status',
  templateUrl: './set-bug-status.component.html',
  styleUrls: ['./set-bug-status.component.css']
})
export class SetBugStatusComponent implements OnInit {

  private readonly currentBug: Bug;
  public setBugStatusFormGroup!: FormGroup;
  public readonly statusOptions = BugStatusSelectData;
  public submitDisabled: boolean = true;

  private subscription: Subscription | undefined;

  constructor(private formBuilder: FormBuilder,
              private bugService: BugService,
              private notificationService: NotificationService,
              private dialogRef: MatDialogRef<SetBugStatusComponent>,
              @Inject(MAT_DIALOG_DATA) private data: {content: Bug})
  {
    this.currentBug = data.content;
  }

  ngOnInit(): void
  {
    this.createSetStatusFormGroup();
  }

  private createSetStatusFormGroup()
  {
    this.setBugStatusFormGroup = this.formBuilder.group
    ({
      status: ['', Validators.required]
    });
  }

  onSubmit()
  {
    if(this.setBugStatusFormGroup.invalid)
    {
      this.setBugStatusFormGroup.markAllAsTouched();
      return;
    }

    const status = this.getBugStatusEnumName();
    this.setStatus(status);
  }

  private getBugStatusEnumName()
  {
    const status = this.getStatus()?.value;
    return BugEnumMapper.mapStatusToEnumName(status);
  }


  private setStatus(status: string)
  {
    this.subscription =
    this.bugService.setStatus(this.currentBug.id, status).subscribe(
      {
        next: this.onStatusSetSuccessfully(),
        error: this.onError()
      });
  }

  private onStatusSetSuccessfully()
  {
    return (response: CustomHttpResponse) =>
    {
      this.currentBug.status = this.getStatus()?.value;
      this.notificationService.notify(NotificationType.SUCCESS, response.message);
      this.dialogRef.close();
    }
  }

  private onError()
  {
    return (errorResponse: HttpErrorResponse) =>
    {
      this.notificationService.notify(NotificationType.ERROR, errorResponse.error.message);
    }
  }

  onSelectOption()
  {
    this.submitDisabled = false;
  }

  ngOnDestroy()
  {
    this.subscription?.unsubscribe();
  }

  private getStatus()
  {
    return this.setBugStatusFormGroup.get('status');
  }
}
