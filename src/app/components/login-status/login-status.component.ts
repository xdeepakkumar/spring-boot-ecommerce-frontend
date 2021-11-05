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

  storage : Storage = sessionStorage;

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
          //  retrieve the user's email from authentication response
          const theEmail = res.email;

          // now store the email in the browser  storage
          this.storage.setItem('userEmail', JSON.stringify(theEmail));
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
