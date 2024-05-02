import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  genre: any = "";

  director: any = "";

  user: any = {};

  userData = { UserId: "", FavoriteMovies: [] }

  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  // Fetch all movies
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  // Open dialog with genre details
  openGenreDialog(genre: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        genre: genre,
        description: description
      },
      width: '500px'
    });
  }

  // Open dialog with director details
  openDirectorDialog(director: string, bio: string, birthdate: string,): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        directorName: director,
        bio: bio,
        birthdate: birthdate,
      },
      width: '500px',
    });
  }

  openSynopsisDialog(movieName: string, description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        movieName: movieName,
        description: description
      },
      width: '500px',
    });
  }

  // Users favorite movies
  getFavorites(username: string): void {
    const token = localStorage.getItem('token');
    this.fetchApiData.getFavouriteMovies(username).subscribe(
      (resp: any) => {
        this.favoriteMovies = resp.favoriteMovies;
      },
      (error: any) => {
        // Handle error, such as displaying an error message
        console.error('Failed to fetch favorite movies:', error);
      }
    );
  }

  // Function to check if a movie is in the user's favorite list
  isFav(movie: any): boolean {
    return this.favoriteMovies.includes(movie._id);
  }

  // Function to toggle a movie in the user's favorite list
  toggleFav(movie: any): void {
    console.log('toggleFav called with movie:', movie);
    const isFavorite = this.isFav(movie);
    console.log('isFavorite:', isFavorite);
    isFavorite
      ? this.deleteFavMovies(movie)
      : this.addFavMovies(movie);
  }

  //  Function to add a movie to the user's favorite list
  addFavMovies(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.fetchApiData.addFavouriteMovies(movie).subscribe((resp) => { // Update the method to match your fetchApiData
        console.log('server response:', resp);
        localStorage.setItem('user', JSON.stringify(resp));
        this.getFavorites(parsedUser.username);
        this.snackBar.open(`${movie.movieName} has been added to your favorites`, 'OK', {
          duration: 3000,
        });
      });
    }
  }

  deleteFavMovies(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.fetchApiData.deleteFavoriteMovie(movie._id).subscribe((resp) => {
        localStorage.setItem('user', JSON.stringify(resp));
        this.getFavorites(parsedUser.username);
        this.snackBar.open(`${movie.movieName} has been removed from your favorites`, 'OK', {
          duration: 3000,
        });
      });
    }
  }
}












