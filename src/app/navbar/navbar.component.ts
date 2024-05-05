import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  public userName: string = "";
  // //  Path to the logo image displayed in the navbar. 
  // public imagePath: string = "/assets/My flix app2.png"

  constructor(
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  // ngOnInit lifecycle hook
  ngOnInit(): void {
    this.userName = JSON.parse(localStorage.getItem("user")!).userName;
  }

  // Function to navigate to the movies page.
  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  // Function to navigate to the profile page.
  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  // Function to log out the user.
  public logoutUser(): void {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    this.snackBar.open('You have been logged out', 'OK', {
      duration: 2000,
    });
    this.router.navigate(['welcome']);
  }
}
