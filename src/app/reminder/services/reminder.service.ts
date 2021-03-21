import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  private apiUrl =
    'http://api.openweathermap.org/data/2.5/forecast';
  constructor(private http: HttpClient) {}
  get(idCity: string): Observable<any> {
    const url = `${this.apiUrl}`;
    let params = new HttpParams()
      .set('id', idCity)
      .set('appid', 'API_KEY');

    return this.http.get(url, {params: params}).pipe(
      map(
        (res: any): any[] => {
          const array: any[] = [];
          res.list.forEach((r: any) => {
            const obj: any = {
              date: new Date(r.dt_txt),
              weather: r.weather[0].main,
            };
            array.push(obj);
          })
          return array;
        }
      ),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
