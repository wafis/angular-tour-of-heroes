import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MessageService} from "./message.service";
import {Hero} from "./hero";
import {catchError, map, tap} from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class HeroService {
  private heroesUrl = "api/heroes";

  httpOptions = {
    headers: new HttpHeaders({"Content-Type": "application/json"})
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log("fetched heroes")),
      catchError(this.handleError<Hero[]>("getHeroes", []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>("updateHero"))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero with id=${newHero.id}`)),
      catchError(this.handleError<Hero>("addHero"))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === "number" ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>("deleteHero"))
    );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      //Todo send error to remote logging infrastructure
      console.error(error);

      //todo better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // let app keep running by returning empty result
      return of(result as T);
    };
  }
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
