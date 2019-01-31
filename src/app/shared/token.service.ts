import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tokenKey } from "@angular/core/src/view";
import { Subject } from "rxjs";


@Injectable({providedIn:'root'})
export class TokenService{
   
    token;
    private tokenUpdated = new Subject<any>();

    ErrorAudio: HTMLAudioElement = new Audio('sounds/error.wav');
    SuccessAudio: HTMLAudioElement = new Audio('sounds/success.wav');

    constructor(private http: HttpClient){}
    
    playSuccess(){
        this.SuccessAudio.play();
    }
    playError(){
        this.ErrorAudio.play();
    }

    getToken(){
        return this.token;
    }

    tokenUpdateListener(){
        return this.tokenUpdated.asObservable();
    }

    getNewToken(){
        
         let params = { token : '17568c13cd21c66574768a82d927f697',
                        applicationId : 'db3695da-e3b3-4d92-8981-5d8dee809f46',
                        applicationSecret : '2004f0b7-9dae-4a95-9337-feaf450ef996' };

        this.http
        .get(
            "https://api.linnworks.net/api/Auth/AuthorizeByApplication",
            {params}
        )
        .subscribe((responseData:any) => {
            this.token = responseData.Token;
            this.tokenUpdated.next(this.token)
        });

        
    }
    
    
}