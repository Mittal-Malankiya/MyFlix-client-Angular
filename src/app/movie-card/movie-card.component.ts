import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog
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
}