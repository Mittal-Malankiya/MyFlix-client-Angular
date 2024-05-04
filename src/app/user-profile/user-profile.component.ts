import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


// Component Imports
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() userData: any = { userName: '', password: '', email: '', birthday: '' };
  formUserData: any = {
    userName: '',
    password: '',
    email: '',
    birthday: '',
    favoriteMovie: []
  };
  user: any = {};
  movies: any[] = [];
  favoritemovie: any[] = [];
  favoriteMoviesIDs: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getProfile();
    this.getMovies(); // Call getMovies() on component initialization
    this.getFavMovies(); // Call getFavMovies() on component initialization
  }

  public getProfile(): void {
    this.fetchApiData.getUser().subscribe((result: any) => {
      console.log('result:', result);
      this.user = result;
      this.userData.userName = this.user.userName;
      this.userData.email = this.user.email;
      if (this.user.birthday) {
        let Birthday = new Date(this.user.birthday);
        if (!isNaN(Birthday.getTime())) {
          this.userData.birthday = Birthday.toISOString().split('T')[0];
        }
      }
      this.formUserData = { ...this.userData };
      this.favoriteMoviesIDs = this.user.favoriteMovie;

      this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
        this.favoritemovie = movies.filter((movie: any) => this.favoriteMoviesIDs.includes(movie._id));
      });
    });
  }

  // Get all movies from the database
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((result: any) => {
      if (Array.isArray(result)) {
        this.movies = result;
      }
      return this.movies;
    });
  }

  // Function to get user's favorite movies
  getFavMovies(): void {
    this.fetchApiData.getUser().subscribe((result) => {
      this.favoriteMoviesIDs = result.FavoriteMovies;
    });
  }

  // Method to check if a movie is in the user's favorite movies list
  isFav(movie: any): boolean {
    return this.favoriteMoviesIDs.includes(movie._id);
  }


  // toggleFav method adds or removes a movie from the user's favorite movies list.
  toggleFav(movie: any): void {
    const isFavorite = this.isFav(movie);
    isFavorite
      ? this.deleteFavMovies(movie)
      : this.addFavMovies(movie);
  }

  // addFavMovies method adds a movie to the user's favorite movies list.

  addFavMovies(movie: any): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      this.fetchApiData.addFavouriteMovies(user.userName, movie._id).subscribe((result) => {
        localStorage.setItem('user', JSON.stringify(result));
        this.getFavMovies(); // Refresh favorite movies after adding a new one
        this.snackBar.open(`${movie.movieName} has been added to your favorites`, 'OK', {
          duration: 1000,
        });
      });
    }
  }
  // deleteFavMovies method removes a movie from the user's favorite movies list.

  deleteFavMovies(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.userData.UserId = parsedUser._id;
      this.fetchApiData.deleteFavoriteMovie(parsedUser._id, movie._id).subscribe((result) => {
        localStorage.setItem('user', JSON.stringify(result));
        // Filter out the deleted movie from the favoriteMovies array
        this.favoritemovie = this.favoritemovie.filter(favoritemovie => favoritemovie.movieid !== movie._id);
        this.snackBar.open(`${movie.movieName} has been removed from your favorites`, 'OK', {
          duration: 1000,
        });
      });
    }
  }

  //Update user

  updateUser(): void {
    this.fetchApiData.updateUser(this.formUserData).subscribe((result) => {
      console.log('User update success:', result);
      localStorage.setItem('user', JSON.stringify(result));
      this.snackBar.open('User updated successfully!', 'OK', {
        duration: 2000,
      });
      this.getProfile();
    }, (error) => {
      console.log('Error updating user:', error);
      this.snackBar.open('Failed to update user', 'OK', {
        duration: 2000,
      });
    });
  }

  // deleteUser method deletes the user's account.

  async deleteUser(): Promise<void> {
    console.log('deleteUser function called:', this.userData.email)
    if (confirm('Do you want to delete your account permanently?')) {
      this.fetchApiData.deleteUser().subscribe(() => {
        this.snackBar.open('Account deleted successfully!', 'OK', {
          duration: 3000,
        });
        localStorage.clear();
        this.router.navigate(['welcome']);
      });
    }
  }
  //  openGenreDialog, openDirectorDialog, and openSynopsisDialog methods open dialogues for viewing genre, director, and movie synopsis information respectively.

  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: name,
        Description: description
      },
      width: '500px',
    });
  }

  openDirectorDialog(director: string, bio: string, birth: string): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        directorName: director,
        Bio: bio,
        Birth: birth,
      },
      width: '500px',
    });
  }

  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        Title: title,
        Description: description
      },
      width: '500px',
    });
  }

}