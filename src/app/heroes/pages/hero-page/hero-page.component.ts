import { Component, OnInit } from '@angular/core';
import { HeroService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, delay, switchMap } from 'rxjs/operators';
import { Hero } from '../../interfaces/hero.interface';


@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: ``
})
export class HeroPageComponent implements OnInit {

  public hero?:Hero;

  constructor(
    private heroesService:HeroService,
  private activateRoute:ActivatedRoute,
private router:Router) {
    
  }
  ngOnInit(): void {
    this.activateRoute.params
      .pipe(
        delay(3000),
        switchMap(({id}) => this.heroesService.getHeroById(id))
      ).subscribe(hero => {
        if(!hero) return this.router.navigate(['/heroes/list']);

        this.hero = hero;
        console.log({hero})
        return;
      } )
  }

  goBack():void {

    this.router.navigateByUrl('/heroes/list');

  }

}
