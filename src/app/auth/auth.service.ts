import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Subject } from "rxjs";


@Injectable({providedIn:'root'})
export class AuthService{
    private authTokenUpdated = new Subject<any>();
    token:string;
    userId:string;
    usersRef: AngularFireList<{userId:string, name:string,email:string, role:string}>;
    constructor(private http: HttpClient,  private router: Router, public db: AngularFireDatabase){
        this.usersRef = db.list('/users');
    }

    getToken() {
        firebase.auth().currentUser.getIdToken()
            .then(
            (token: string) => this.token = token
            );
        return this.token;
    }
    
    authTokenUpdateListener(){
        return this.authTokenUpdated.asObservable();
    }
       
    
    signupUser(name:string, email: string, password: string) {
        
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(response=>{
 
                this.userId = response.user.uid;
                firebase.auth().currentUser.getIdToken()
                .then(
                    (token: string) => {
                        this.usersRef.push({userId:this.userId,name,email,role:'waiting'})
                        this.token = token;
                        this.router.navigate(['/welcome']);
                    }
                )
            })
            .catch(
            error => console.log(error)
            )
    }

    signinUser(email: string, password: string) {
        
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(
        response => {
            firebase.auth().currentUser.getIdToken()
            .then(
                (token: string) => {
                    this.token = token;
                    this.authTokenUpdated.next(this.token);
                    this.router.navigate(['/']);
                }
            )
            }
        )
        .catch(
        error => console.log(error)
        );
    }

    logout() {
        firebase.auth().signOut();
        this.token = null;
        this.authTokenUpdated.next(this.token);
        this.router.navigate(['/login']);
      
    }
    
    isAuthenticated() {
        if(this.token !=null){
            return true;
        }
        else{
            return false
        }
    
    }


}