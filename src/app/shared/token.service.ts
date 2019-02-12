import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase';
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({providedIn:'root'})
export class TokenService{
    apiTokenRef: AngularFireList<{token:string,
        applicationId:string,
        applicationSecret:string}>;
    createCredentials
    token;
    server;
    accountFullname
    private tokenUpdated = new Subject<any>();
    private nameUpdated = new Subject<any>();
    ErrorAudio: HTMLAudioElement = new Audio('sounds/error.wav');
    SuccessAudio: HTMLAudioElement = new Audio('sounds/success.wav');

    constructor(private http: HttpClient, public db: AngularFireDatabase, private router: Router){
        this.apiTokenRef = db.list('/apiToken');
    }
    
    playSuccess(){
        this.SuccessAudio.play();
    }
    playError(){
        this.ErrorAudio.play();
    }
    getName(){
        return this.accountFullname;
    }
    getToken(){
        return this.token;
    }
    getServer(){
        return this.server;
    }
    getCredentials(){
        return this.createCredentials;
    }

    tokenUpdateListener(){
        return this.tokenUpdated.asObservable();
    }
    nameUpdateListener(){
        return this.nameUpdated.asObservable();
    }
    // realTimeUpdateToken(){
    //     this.apiTokenRef.valueChanges().subscribe(a=>{
    //         console.log(a)
    //     })
    // }
    getNewToken(){
        this.http.get('https://arvin-8a261.firebaseio.com/apiToken.json')
        .subscribe((tokenRes:any)=>{
            let params = { token : tokenRes.token,
                        applicationId : tokenRes.applicationId,
                        applicationSecret : tokenRes.applicationSecret };
            this.createCredentials = params;
            
            this.http
            .get(
                "https://api.linnworks.net/api/Auth/AuthorizeByApplication",
                {params}
            )
            .subscribe((responseData:any) => {
                console.log('SAVED')
                this.accountFullname = responseData.FullName;
                this.token = responseData.Token;
                this.server = responseData.Server;
                this.tokenUpdated.next(this.token);
                this.nameUpdated.next(this.accountFullname);
            });
        })


        
        //TEST
        //  let params = { token : '17568c13cd21c66574768a82d927f697',
        //                 applicationId : 'db3695da-e3b3-4d92-8981-5d8dee809f46',
        //                 applicationSecret : '2004f0b7-9dae-4a95-9337-feaf450ef996' };



                // //LIVE 
                //         let params = { token : 'd1ded4727d8204b3f3ca88c475a24533',
                //         applicationId : 'f01c4825-1eaa-4ad7-88da-74dec836d94a',
                //         applicationSecret : '9bef39a1-0376-4b48-8b06-2142fe3c98c5' };

        

        
    }

    
    updateToken(token:string,applicationId:string,applicationSecret:string){
        let params = { token, applicationId, applicationSecret};
        this.http
            .get(
                "https://api.linnworks.net/api/Auth/AuthorizeByApplication",
                {params}
            )
            .subscribe((tokenRes: any)=>{
                    
                    let tokenUpdate = firebase.database().ref();
                    tokenUpdate.child('apiToken/').update({token,applicationId,applicationSecret}).then(a=>{
                        this.playSuccess();
                        this.createCredentials = params;
                        this.accountFullname = tokenRes.FullName;
                        this.token = tokenRes.Token;
                        this.server = tokenRes.Server;
                        this.tokenUpdated.next(this.token);
                        this.nameUpdated.next(this.accountFullname);
                    })
                    
            },
            err => {
                this.playError();
            })


    
    }
    
    // getNewTokenFake(){
    //     this.http.get('https://arvin-8a261.firebaseio.com/apiToken.json')
    //     .subscribe((tokenRes:any)=>{
    //         let params = { token : "17568c13cd21c66574768a82d927f697dfs",
    //                     applicationId : "db3695da-e3b3-4d92-8981-5kamoted8dee809f46",
    //                     applicationSecret : "2004f0b7-9dae-4a95-93dkjf37-feaf450ef996" };
    //         this.createCredentials = params;
            
    //         this.http
    //         .get(
    //             "https://api.linnworks.net/api/Auth/AuthorizeByApplication",
    //             {params}
    //         )
    //         .subscribe((responseData:any) => {
    //             this.accountFullname = responseData.FullName;
    //             this.token = responseData.Token;
    //             this.server = responseData.Server;
    //             this.tokenUpdated.next(this.token);
    //             this.nameUpdated.next(this.accountFullname);
    //         });
    //     })
    // }

}