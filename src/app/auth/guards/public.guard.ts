import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    CanMatchFn,
    Route,
    Router,
    RouterStateSnapshot,
    UrlSegment,
  } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, tap } from 'rxjs';
import { inject } from '@angular/core';


 

    const  checkAuthStatus = () : Observable<boolean> => {

        const authService: AuthService = inject(AuthService);
        const router:Router = inject(Router);

        

        return authService.checkAuthentication()
                .pipe(
                    tap((isAuthenticated) => console.log('Authenticated:',isAuthenticated)),
                    tap((isAuthenticated)=> {
                        if(isAuthenticated) {
                            router.navigate(['/']);
                        }
                    }),
                    // map(isAuthenticated => !isAuthenticated)
                )
                

    }

      //No hay necesidad de crear una clase, simplemente definiendo una función flecha y exportándola podemos utilizar sus funcionalidades de guard en el app-routing
 export const    canActivateGuardPublic: CanActivateFn = ( //Hay que tener en cuenta el tipado CanActiveFn
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    return checkAuthStatus();

  };
   
    export const canMatchGuardPublic: CanMatchFn = ( //Tipado CanMatchFN
    route: Route,
    segments: UrlSegment[]
  ) => {
        return checkAuthStatus();
  };
  

   
