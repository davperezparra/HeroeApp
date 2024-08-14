import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({providedIn: 'root'})
export class HeroService {

    private baseUrl:string = environments.baseUrl;

    constructor(private http: HttpClient) { }

    // Obtener Heroes
    getHeroes():Observable<Hero[]> {

        return  this.http.get<Hero[]>(`${this.baseUrl}/api/heroes/`);
    } 

    getHeroById(id:string):Observable<Hero| undefined> {

        return this.http.get<Hero>(`${this.baseUrl}/api/heroes/${id}`)
                .pipe(

                    catchError(error  => of(undefined))
                );
    }

    getSuggestions(query:String):Observable<Hero[]> {

        return this.http.get<Hero[]>(`${this.baseUrl}/api/heroes/${query}/6`);

            

    }

    addHero(hero:Hero):Observable<Hero>{
        return this.http.post<Hero>(`${this.baseUrl}/api/heroes`,hero);
    }

    updateHero(hero:Hero):Observable<Hero>{
        if(!hero.id) throw Error('Hero id is required');
        return this.http.patch<Hero>(`${this.baseUrl}/api/heroes/${hero.id}`,hero);
    
    }

    deleteHeroById(id:string):Observable<boolean>{
       
        return this.http.delete<Hero>(`${this.baseUrl}/api/heroes/${id}`)
                .pipe(
                    map(resp => true),

                    catchError( err => of(false)),
                );
    
    }
    //[]
}