import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap, take } from 'rxjs';


//Declaring the api url that will provide data for the client app
const apiUrl = 'https://myflixapp-cw0r.onrender.com/';
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Making the api call for the user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Making the api call for the user Get all movies endpoint
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  // Non-typed response extraction
  private extractResponseData(res: object): any {
    const body = res;
    return body || {};
  }


  // Making the api call for the user Get One movie endpoint
  getOneMovies(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for the user Get Director endpoint
  getDirector(Name: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/directors/:Name', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for the user Get Genre endpoint
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/:Name', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for the Get User endpoint.
  getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    const url = apiUrl + "users/" + user.userName;
    const headers = new HttpHeaders({
      Authorization: "Bearer " + token,
    });
    return this.http.get(url, { headers }).pipe(
      tap((result: any) => {
      }),
      map(this.extractResponseData),
      catchError((error) => {
        console.error("API Error:", error);
        return this.handleError(error);
      })
    );
  }

  //Making the api call for the Get Favourite Movies for a user endpoint.
  getFavouriteMovies(userName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + userName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //  Making the api call for the Add a Movie to Favourite Movies endpoint.
  addFavouriteMovies(userId: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'users/' + userId + '/movies/' + movieId, null, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for the Update User endpoint.
  updateUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + userDetails.userName, userDetails, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //  Making the api call for the Delete User endpoint.
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`
    });
    return this.http.delete(apiUrl + 'users/' + user.email, { headers: headers, responseType: 'text' })
      .pipe(take(1), catchError(this.handleError));
  }


  // Making the api call to delete a movie from the user's favorite list
  deleteFavoriteMovie(movieid: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    console.log('Deleting movie with ID:', movieid);
    return this.http.delete(apiUrl + 'users/' + user.userName + '/movies/' + movieid, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Handling of HTTP errors.
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    // Return an observable with an error message
    const err = new Error('Something went wrong, please try again later.');
    throwError(() => err);
  }

}