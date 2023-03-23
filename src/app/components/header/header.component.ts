import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {AuthenticationService} from "../../service/authentication.service";
import {Router} from "@angular/router";
import {UserRoleMap} from "../../const/user-role-map";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']

})
export class HeaderComponent implements OnInit
{
  public readonly userRoleMap = UserRoleMap;
  public readonly currentUser: User;

  constructor(private authenticationService: AuthenticationService,
              private router: Router)
  {
    this.currentUser = this.authenticationService.getUserFromLocalCache();
  }

  ngOnInit(): void
  {}

  onLogout()
  {
    this.authenticationService.logOut();
    this.router.navigateByUrl('/login')
  }

}
