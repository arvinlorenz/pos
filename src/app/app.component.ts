import { Component, OnInit } from '@angular/core';
import { OrderService } from './order/order.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'pos';

  constructor(private orderService: OrderService){}
  ngOnInit(){
    this.orderService.getNewToken();
  }

}
