import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ProjectService} from "../../service/project.service";
import {Project} from "../../model/project";
import {AuthenticationService} from "../../service/authentication.service";
import {User} from "../../model/user";
import {NotificationService} from "../../service/notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import {LoaderService} from "../../service/loader.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

  currentAppUser: User;
  editProjectFormGroup!: FormGroup;

  currentProject: Project;

  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
              private loaderService: LoaderService,
              private projectService: ProjectService,
              private notificationService: NotificationService,
              private authenticationService: AuthenticationService,
              private dialogRef: MatDialogRef<EditProjectComponent>,
              @Inject(MAT_DIALOG_DATA) private data: {content: Project})
  {
    this.currentProject = this.data.content;
    this.currentAppUser = this.authenticationService.getUserFromLocalCache();
  }

  ngOnInit(): void
  {
    this.createEditProjectFormGroup();
  }

  private createEditProjectFormGroup()
  {
    this.editProjectFormGroup = this.formBuilder.group
    ({
      name: new FormControl(this.currentProject.name,
        [Validators.required, Validators.minLength(5), Validators.maxLength(40)]),
      description: new FormControl(this.currentProject.description,
        [Validators.required, Validators.minLength(10), Validators.maxLength(300)])
    });
  }

  onSubmit()
  {
    if(this.editProjectFormGroup.invalid)
    {
      this.editProjectFormGroup.markAllAsTouched();
      return;
    }

    let formData = new FormData();
    formData.append('currentName', this.currentProject.name);
    formData.append('newName', this.getProjectNameFormControl()?.value);
    formData.append('newDescription', this.getProjectDescriptionFormControl()?.value);

    this.onUpdateProject(formData);
  }

  private onUpdateProject(formData: FormData)
  {
    this.subscriptions.push(
    this.projectService.editProject(this.currentAppUser.id, this.currentProject.name, formData).subscribe(
      {
        next: this.onProjectUpdatedSuccessfully(),
        error: this.onError()
      }));
  }

  private onProjectUpdatedSuccessfully()
  {
    return (response: Project) =>
    {
      this.mapEditedProjectToCurrent(response);
      const message = 'Project: \'' + response.name + '\' edited successfully!';
      this.notificationService.sendSuccessNotification(message);
      this.dialogRef.close();
    }
  }

  private onError()
  {
    return (errorResponse: HttpErrorResponse) =>
    {
      this.notificationService.sendErrorNotification(errorResponse.error.message);
    }
  }


  private mapEditedProjectToCurrent(editedProject: Project)
  {
    this.currentProject.name = editedProject.name;
    this.currentProject.description = editedProject.description;
  }

  disableSubmitIfFieldsMatching()
  {
    const newProjectName = this.getProjectNameFormControl()?.value;
    const newProjectDescription = this.getProjectDescriptionFormControl()?.value;

    return this.currentProject.name === newProjectName.trimEnd() &&
           this.currentProject.description === newProjectDescription.trimEnd();
  }


  ngOnDestroy()
  {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


  getProjectNameFormControl()
  {
    return this.editProjectFormGroup.get('name');
  }

  getProjectDescriptionFormControl()
  {
    return this.editProjectFormGroup.get('description');
  }
}
