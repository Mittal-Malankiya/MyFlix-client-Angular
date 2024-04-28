import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MyFlix-Angular-Client';
  constructor(public dialog: MatDialog) { }
  openUserRegistrationDialog(): void {
    console.log('UserRegistrationFormComponent');
    this.dialog.open(UserRegistrationFormComponent, { width: '280px' });
  }

  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, { width: '280px' });
  }
}
