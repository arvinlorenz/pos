import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { InventoryService } from '../inventory.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.css']
})
export class InventoryDetailComponent implements OnInit, OnDestroy{
  skuDetails;
  skuDetailsSub: Subscription;

  editMode = false;
  itemId;
  form;
  constructor(public inventoryService: InventoryService, public route: ActivatedRoute) { }

  ngOnInit() {

    this.skuDetailsSub = this.inventoryService.getSkuDetailsUpdateListener()
      .subscribe((skuRes)=>{
        this.skuDetails = skuRes;
      });

    this.route.params
    .subscribe(
      (params: Params)=>{
        this.itemId = params['itemId'];
        this.editMode = params['itemId'] != null; //return true if not equal to null

        if(this.editMode){
          console.log(this.skuDetails)
          this.form = new FormGroup({
            'itemNumber': new FormControl(this.skuDetails.itemNumber, Validators.required),
            'quantity': new FormControl(this.skuDetails.quantity, Validators.required),
            'openOrder': new FormControl(this.skuDetails.openOrder, Validators.required),
            'available': new FormControl(this.skuDetails.available, Validators.required),
            'due': new FormControl(this.skuDetails.due, Validators.required)
          });
        }
      }
    ); 
  }

  ngOnDestroy(){
    this.skuDetailsSub.unsubscribe();
  }

}
