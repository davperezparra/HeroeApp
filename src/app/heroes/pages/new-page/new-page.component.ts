import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id:        new FormControl<string>('')
    /* super hero siempre debe tener un string, por eso nonNullable*/,
    superhero: new FormControl<string>('',{nonNullable:true}),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img:    new FormControl(''),
  });

  public publishers = [
    {id:'DC Comics', desc:'DC - Comics'},
    { id:'Marvel Comics', desc:'Marvel - comics' }
  ]


  constructor(private heroesService:HeroService,
      private activatedRoute: ActivatedRoute,
    private router: Router,
        private snackbar: MatSnackBar,
        private dialog: MatDialog,


    ){}
  ngOnInit(): void {
    
    if(!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
      switchMap(({id})=> this.heroesService.getHeroById(id))
      ).subscribe(hero => {
        if(!hero) {
          return this.router.navigateByUrl('/');
        }

        this.heroForm.reset(hero);
        return;
      })

  }

  get currentHero():Hero {

    const hero = this.heroForm.value as Hero;
    return hero;
    
  }

  onSubmit():void {

      if(this.heroForm.invalid) return;


      if(this.currentHero.id){
        this.heroesService.updateHero(this.currentHero)
            .subscribe(hero => {
              // TODO: mostrar snackbar
              this.showSnackbar(`${ hero.superhero } updated!`);

            });

            return ;
      }

      this.heroesService.addHero(this.currentHero)
          .subscribe(hero => {
            // TODO : MOSTRAR SNACKBAR, Y NAVEGAR A /HEROES/EDIT/HERO.ID
            this.router.navigate(['/heroes/edit', hero.id ]);

            this.showSnackbar(`${ hero.superhero } created!`);

          });
  }

      onDeleteHero(){
        if ( !this.currentHero.id ) throw Error('Hero id is required');

        const dialogRef = this.dialog.open( ConfirmDialogComponent, {
          data: this.heroForm.value
        });

        dialogRef.afterClosed().
        pipe(
          filter((result:boolean) => result),
          switchMap(()=> this.heroesService.deleteHeroById(this.currentHero.id)),
          filter((wasDelete:boolean) => wasDelete),
        ).
        
        subscribe(() => {
          this.router.navigate(['/heroes']);
        });


        // dialogRef.afterClosed().subscribe((result) => {
        //     if(!result) return;
        //     console.log('deleted');
        //     this.heroesService.deleteHeroById(this.currentHero.id)
        //     .subscribe(wasDeleted=> {
        //       if(wasDeleted)
        //         this.router.navigate(['/heroes']);

        //     })
        // });
    
        


      }

  showSnackbar(message:string):void {
  this.snackbar.open(message,'done',{
    duration: 2500,

  })}
  
}
