import { Injectable } from "@angular/core";



@Injectable({providedIn:'root'})
export class SoundsService{

    private ErrorAudio: HTMLAudioElement = new Audio('sounds/error.wav');
    private SuccessAudio: HTMLAudioElement = new Audio('sounds/success.wav');

    constructor(){}
    
    playSuccess(){
        this.SuccessAudio.play();
    }
    playError(){
        this.ErrorAudio.play();
    }


    
    
    
}