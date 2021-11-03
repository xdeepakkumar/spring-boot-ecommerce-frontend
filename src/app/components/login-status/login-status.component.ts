import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = true;
  userFullName: string;


  constructor(private _oktaAuthService: OktaAuthService) { }

  ngOnInit(): void {
    // subscribe to authentication state changes
    this._oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result
        this.getUserDetails();
      }
    )
  }
  getUserDetails() {
    if(this.isAuthenticated){
      this._oktaAuthService.getUser().then(
        (res:any) => {
          this.userFullName = res.name;
        },
        (error)=> {
          throw error;
        }
      )
    }
  }
  logout(){
    this._oktaAuthService.signOut();
  }
}
