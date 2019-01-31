import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { InventoryService } from '../inventory.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TokenService } from 'src/app/shared/token.service';
import { tokenKey } from '@angular/core/src/view';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.css']
})
export class InventoryDetailComponent implements OnInit, OnDestroy{
  skuDetails;
  skuDetailsSub: Subscription;

  editMode = false;
  showInfo = false;
  itemId;
  form: FormGroup;
  @ViewChild("quantity") quantityField: ElementRef;
  constructor(public inventoryService: InventoryService, public tokenService: TokenService, public route: ActivatedRoute) { }

  ngOnInit() {

    this.skuDetailsSub = this.inventoryService.getSkuDetailsUpdateListener()
      .subscribe((skuRes)=>{
        this.skuDetails = skuRes;
        console.log(this.skuDetails)
      });
      
      
    this.tokenService.tokenUpdateListener().subscribe(a=>{

    })
      this.route.paramMap
        .subscribe(
        (paramMap: ParamMap)=>{
            
          if(paramMap.has('itemId')){
            this.itemId = paramMap.get('itemId');
            console.log(this.itemId)
            this.editMode = false;
            if(this.tokenService.getToken() === undefined)
            {
              this.tokenService.tokenUpdateListener().subscribe(a=>{
                this.inventoryService.getSkuDetails(this.itemId).subscribe((resSku:any[])=>{
                
                  if(resSku.length === 0){
                    return;
                  }
                  else{
                    console.log(resSku)
                    this.showInfo = true;
                    let itemDetails = {
                      itemNumber: resSku[0].ItemNumber,
                      available: resSku[0].Available,
                      quantity: resSku[0].Quantity,
                      openOrder:resSku[0].InOrder,
                      due: resSku[0].Due,
                      bin: resSku[0].binRack
              
                    }
                    this.inventoryService.setSkuDetails(itemDetails);
                    this.form = new FormGroup({
                      itemNumber: new FormControl(this.skuDetails.itemNumber, Validators.required),
                      quantity: new FormControl(this.skuDetails.quantity, Validators.required),
                      openOrder: new FormControl(this.skuDetails.openOrder, Validators.required),
                      available: new FormControl(this.skuDetails.available, Validators.required),
                      due: new FormControl(this.skuDetails.due, Validators.required)
                    });
                    this.form.controls.itemNumber.disable();
                    this.form.controls.quantity.disable();
                    this.form.controls.openOrder.disable();
                    this.form.controls.available.disable();
                    this.form.controls.due.disable();
                  }
                
                });
              })
            }
            else{
              this.inventoryService.getSkuDetails(this.itemId).subscribe((resSku:any[])=>{
                
                if(resSku.length === 0){
                  return;
                }
                else{
                  console.log(resSku)
                  this.showInfo = true;
                  let itemDetails = {
                    itemNumber: resSku[0].ItemNumber,
                    available: resSku[0].Available,
                    quantity: resSku[0].Quantity,
                    openOrder:resSku[0].InOrder,
                    due: resSku[0].Due,
                    bin: resSku[0].binRack
            
                  }
                  this.inventoryService.setSkuDetails(itemDetails);
                  this.form = new FormGroup({
                    itemNumber: new FormControl(this.skuDetails.itemNumber, Validators.required),
                    quantity: new FormControl(this.skuDetails.quantity, Validators.required),
                    openOrder: new FormControl(this.skuDetails.openOrder, Validators.required),
                    available: new FormControl(this.skuDetails.available, Validators.required),
                    due: new FormControl(this.skuDetails.due, Validators.required)
                  });
                  this.form.controls.itemNumber.disable();
                  this.form.controls.quantity.disable();
                  this.form.controls.openOrder.disable();
                  this.form.controls.available.disable();
                  this.form.controls.due.disable();
                }
              
              });
            }
              
          }
        }    
        ); 
        
  }

  edit(){
    this.editMode = true;
    //this.form.controls.itemNumber.enable();
    this.form.controls.quantity.enable();
    this.quantityField.nativeElement.focus();
    // this.form.controls.openOrder.enable();
    // this.form.controls.available.enable();
    // this.form.controls.due.enable();
  }
  cancel(){
    this.editMode = false;
    this.form.controls.itemNumber.disable();
    this.form.controls.quantity.disable();
    this.form.controls.openOrder.disable();
    this.form.controls.available.disable();
    this.form.controls.due.disable();
  }

  save(){
    let newQuantity = this.form.value.quantity;
    
    this.inventoryService.setQuantity(this.itemId,newQuantity)
      .subscribe(a =>{
        this.form.controls.quantity.disable();
        this.editMode = false;
      })
  }
  ngOnDestroy(){
    this.skuDetailsSub.unsubscribe();
  }

}
