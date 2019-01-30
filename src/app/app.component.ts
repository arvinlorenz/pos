import { Component, OnInit } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { TokenService } from './shared/token.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'pos';

  constructor(private tokenService: TokenService){}
  ngOnInit(){
    this.tokenService.getNewToken();
  }

}
