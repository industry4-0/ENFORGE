import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private _snackBar: MatSnackBar,private router: Router){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        const idToken = localStorage.getItem("demo_token");
        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + idToken)
            });
            return next.handle(cloned)
                .pipe(
                    retry(1),
                    catchError((error: HttpErrorResponse) => this.handleError(error))
                )
        }
        else {
            return next.handle(req)
                .pipe(
                    retry(1),
                    catchError((error: HttpErrorResponse) => this.handleError(error))
                )
        }
    }

    handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        let customErrorMessage: string;
        if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `${error.error.message}`;
        } else {
            // server-side error
            if(error.status == 418) customErrorMessage = 'Files not ready yet.\nTry again later.'
            else if(error.status == 404)  customErrorMessage = 'Sorry, we couldn\'t find what you were looking for.'
            else if(error.status == 500) this.router.navigateByUrl('/internal-server-error')
            else errorMessage = `${error.message}`;
        }
        console.log(errorMessage)
        this.showError(customErrorMessage || 'Something bad happened. Try again later.') 
        //window.alert(errorMessage);
        return throwError(errorMessage);
    }

    showError(errorMessage: string){
        this._snackBar.open(errorMessage, 'Ok', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['warning']
          });
    }
}