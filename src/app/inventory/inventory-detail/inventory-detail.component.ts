import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { InventoryService } from '../inventory.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TokenService } from 'src/app/shared/token.service';
import { SoundsService } from 'src/app/shared/sounds.service';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.css']
})
export class InventoryDetailComponent implements OnInit, OnDestroy{
  itemDetails;
  skuDetails;
  skuDetailsSub: Subscription;
  itemStockId;
  editMode = false;
  showButton = false;
  itemId;
  skuform: FormGroup;
  @ViewChild("quantity") quantityField: ElementRef;
  constructor(
      public inventoryService: InventoryService, 
      public tokenService: TokenService, 
      public soundsService: SoundsService,
      public route: ActivatedRoute) { }

  disableAllFields(){
    this.skuform.controls.itemNumber.disable();
    this.skuform.controls.quantity.disable();
    this.skuform.controls.openOrder.disable();
    this.skuform.controls.available.disable();
    this.skuform.controls.due.disable();
    this.skuform.controls.bin.disable();
  }
  skuSubscribe(){
    this.inventoryService.getSkuDetails(this.itemId).subscribe((resSku:any[])=>{
                
      if(resSku.length === 0){
        this.soundsService.playError();
        this.skuform.reset();
        this.showButton = false;
        this.skuform.controls.itemNumber.disable();
        this.skuform.controls.quantity.disable();
        this.skuform.controls.openOrder.disable();
        this.skuform.controls.available.disable();
        this.skuform.controls.due.disable();
        return;
      }
      else{
        console.log(resSku[0]);
        this.showButton = true;
        this.itemDetails = {
          itemNumber: resSku[0].ItemNumber,
          available: resSku[0].Available,
          quantity: resSku[0].Quantity,
          openOrder:resSku[0].InOrder,
          due: resSku[0].Due,
          bin: ''
        }
        this.itemStockId = resSku[0].StockItemId;
        this.inventoryService.getBinRackDetail(resSku[0].StockItemId)
          .subscribe((resBin: any[]) =>{
            if(resBin.length === 0){
              this.inventoryService.setSkuDetails(this.itemDetails);
              this.skuform = new FormGroup({
                itemNumber: new FormControl(this.skuDetails.itemNumber, Validators.required),
                quantity: new FormControl(this.skuDetails.quantity, Validators.required),
                openOrder: new FormControl(this.skuDetails.openOrder, Validators.required),
                available: new FormControl(this.skuDetails.available, Validators.required),
                due: new FormControl(this.skuDetails.due, Validators.required),
                bin: new FormControl('-', Validators.required)
              });
              this.disableAllFields();
            }
            else{
              this.itemDetails.bin = resBin[0].BinRack;
              this.inventoryService.setSkuDetails(this.itemDetails);
              this.skuform = new FormGroup({
                itemNumber: new FormControl(this.skuDetails.itemNumber, Validators.required),
                quantity: new FormControl(this.skuDetails.quantity, Validators.required),
                openOrder: new FormControl(this.skuDetails.openOrder, Validators.required),
                available: new FormControl(this.skuDetails.available, Validators.required),
                due: new FormControl(this.skuDetails.due, Validators.required),
                bin: new FormControl(this.skuDetails.bin, Validators.required)
              });
              this.disableAllFields();
            }
              
          }); 
      }
    
    });
  }
  ngOnInit() {

    this.skuDetailsSub = this.inventoryService.getSkuDetailsUpdateListener()
      .subscribe((skuRes)=>{
        this.skuDetails = skuRes;
      });

    this.skuform = new FormGroup({
      itemNumber: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
      openOrder: new FormControl(null, Validators.required),
      available: new FormControl(null, Validators.required),
      due: new FormControl(null, Validators.required),
      bin: new FormControl(null, Validators.required)
    });
    this.disableAllFields();
      
    this.route.paramMap
        .subscribe(
        (paramMap: ParamMap)=>{
            
          if(paramMap.has('itemId')){
            this.itemId = paramMap.get('itemId');
            this.editMode = false;
            if(this.tokenService.getToken() === undefined)
            {
              this.tokenService.tokenUpdateListener().subscribe(a=>{
                this.skuSubscribe();
              })
            }
            else{
              this.skuSubscribe();
            }
              
          }
        }    
        ); 
        
  }

  edit(){
    this.editMode = true;
    this.skuform.controls.quantity.enable();
    this.skuform.controls.bin.enable();
    this.quantityField.nativeElement.focus();
   
  }
  cancel(){
    this.editMode = false;
    this.disableAllFields();
  }

  save(){
    console.log('hi')
    let newQuantity = this.skuform.value.quantity;
    let available;
    this.inventoryService.setQuantity(this.itemId,newQuantity)
      .subscribe(a =>{
        available = a[0].Available;
        this.inventoryService.setBinRack(this.itemStockId, this.skuform.value.bin)
          .subscribe((a:any)=>{
            
            if(a===null){
              this.inventoryService.setSkuDetails({...this.skuDetails, available ,quantity: newQuantity, bin:this.skuform.value.bin})
              this.disableAllFields();
              this.editMode = false;
              this.soundsService.playSuccess();
            }
          
        })
        
      })
  }
  ngOnDestroy(){
    this.skuDetailsSub.unsubscribe();
  }

}