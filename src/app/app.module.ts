import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule, Routes} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {ResetPasswordEmailComponent} from './components/reset-password-email/reset-password-email.component';
import {AuthenticationService} from "./service/authentication.service";
import {UserService} from "./service/user.service";
import {AuthInterceptor} from "./interceptors/auth.interceptor";

import {RecaptchaModule} from "ng-recaptcha";
import {AuthenticationGuard} from "./guard/authentication.guard";
import {NotificationService} from "./service/notification.service";
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {ChatComponent} from "./components/chat/chat.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {PageBodyComponent} from "./components/page-body/page-body.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ChatListComponent} from "./components/chat-list/chat-list.component";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {ProjectsComponent} from "./components/projects/projects.component";
import {HeaderComponent} from "./components/header/header.component";
import {InboxComponent} from "./components/inbox/inbox.component";
import {ActivateAccountComponent} from "./components/activate-account/activate-account.component";
import {CockpitComponent} from "./components/cockpit/cockpit.component";
import {BugListComponent} from "./components/bug-list/bug-list.component";
import {BugsComponent} from "./components/bugs/bugs.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AddBugComponent} from "./components/add-bug/add-bug.component";
import {MatSelectModule} from "@angular/material/select";
import {NotifierModule, NotifierOptions} from "angular-notifier";
import {EditIssueComponent} from "./components/edit-issue/edit-issue.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {SetBugStatusComponent} from "./components/set-bug-status/set-bug-status.component";
import {UserNotificationComponent} from "./components/user-notification/user-notification.component";
import {UserNotificationPageComponent} from "./components/user-notification-page/user-notification-page.component";
import {ParticipantsListComponent} from "./components/participants-list/participants-list.component";
import {CreateProjectComponent} from "./components/create-project/create-project.component";
import {MatTableModule} from "@angular/material/table";
import {AddParticipantsComponent} from "./components/add-particiapnts/add-participants.component";
import {WarningDialogComponent} from "./components/warning-dialog/warning-dialog.component";
import {AssignUserBugComponent} from "./components/assign-user-bug/assign-user-bug.component";
import {MatSelectInfiniteScrollModule} from "ng-mat-select-infinite-scroll";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {EditProjectComponent} from "./components/edit-project/edit-project.component";
import {SpinnerComponent} from "./components/spinner/spinner.component";
import {LoadingInterceptor} from "./interceptors/loading.interceptor";
import {ProjectComponent} from "./components/project/project.component";
import {SelectProjectComponent} from "./components/select-project/select-project.component";
import {SelectAssigneeComponent} from "./components/select-assignee/select-assignee.component";

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'middle',
      distance: 12
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: false,
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

const routes: Routes =
  [
    { path: 'home', component: DashboardComponent, canActivate: [AuthenticationGuard],
      children:
        [
          { path: 'bugs', component: ProjectsComponent, children: [{ path: 'chat/:id', component: ChatComponent}]},
          { path: 'cockpit', component: CockpitComponent, children: [{ path: 'chat/:id', component: ChatComponent}]},
          { path: 'issues', component: BugsComponent, children: [{ path: 'chat/:id', component: ChatComponent}]},
          { path: 'addIssue', component: AddBugComponent, children: [{ path: 'chat/:id', component: ChatComponent}]},
          { path: 'notifications', component: UserNotificationPageComponent, children: [{ path: 'chat/:id', component: ChatComponent}]},
          { path: 'notifications/select/:notificationId/:index', component: UserNotificationPageComponent, children: [{ path: 'chat/:id', component: ChatComponent}]},
          { path: 'profile', component: UserProfileComponent, children: [{ path: 'chat/:id', component: ChatComponent}]},
          { path: '', redirectTo: '/home/cockpit', pathMatch:'full'}
        ]},

    { path: 'confirm/:token', component: ActivateAccountComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'forgotPassword', component: ResetPasswordEmailComponent},
    { path: 'resetPassword/:token', component: ResetPasswordComponent},
    { path: '**', redirectTo: '/login', pathMatch: 'full'}
  ]

@NgModule({
  declarations: [
    AppComponent,
    ResetPasswordComponent,
    ResetPasswordEmailComponent,
    LoginComponent,
    RegisterComponent,
    ChatComponent,
    DashboardComponent,
    SidebarComponent,
    PageBodyComponent,
    ChatListComponent,
    ProjectsComponent,
    HeaderComponent,
    InboxComponent,
    ActivateAccountComponent,
    CockpitComponent,
    BugListComponent,
    BugsComponent,
    AddBugComponent,
    EditIssueComponent,
    SetBugStatusComponent,
    UserNotificationComponent,
    UserNotificationPageComponent,
    ParticipantsListComponent,
    CreateProjectComponent,
    AddParticipantsComponent,
    WarningDialogComponent,
    AssignUserBugComponent,
    UserProfileComponent,
    EditProjectComponent,
    SpinnerComponent,
    ProjectComponent,
    SelectProjectComponent,
    SelectAssigneeComponent
  ],
    imports: [
      BrowserModule,
      RouterModule.forRoot(routes),
      HttpClientModule,
      ReactiveFormsModule,
      RecaptchaModule,
      NotifierModule.withConfig(customNotifierOptions),
      BrowserAnimationsModule,
      InfiniteScrollModule,
      MatListModule,
      MatCardModule,
      NgbModule,
      MatSelectModule,
      FormsModule,
      MatDialogModule,
      MatInputModule,
      MatTableModule,
      MatSelectInfiniteScrollModule
    ],
  entryComponents: [EditIssueComponent],

  providers:
    [NotificationService, AuthenticationGuard, AuthenticationService, UserService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule
{
}
