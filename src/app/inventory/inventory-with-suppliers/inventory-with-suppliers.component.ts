import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { InventoryService } from '../inventory.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TokenService } from 'src/app/shared/token.service';
import { SoundsService } from 'src/app/shared/sounds.service';

@Component({
  selector: 'app-inventory-with-suppliers',
  templateUrl: './inventory-with-suppliers.component.html',
  styleUrls: ['./inventory-with-suppliers.component.css']
})
export class InventoryWithSuppliersComponent implements OnInit, OnDestroy{
  shippingExtendedProp;
  postageExtendedProp
  skuDetails;
  itemStockId;
  skuDetailsSub: Subscription;
  tokenSub: Subscription;
  imagePath = null;
  editMode = false;
  showButton = false;
  itemId;
  suppliers;
  form: FormGroup;
  @ViewChild("quantity") quantityField: ElementRef;
  constructor(
      public inventoryService: InventoryService, 
      public tokenService: TokenService, 
      public soundsService: SoundsService,
      public route: ActivatedRoute) { }

  disableAllFields(){
    this.form.controls.imageUrl.disable()
    this.form.controls.itemTitle.disable();
    this.form.controls.itemNumber.disable();
    this.form.controls.quantity.disable();
    this.form.controls.openOrder.disable();
    this.form.controls.available.disable();
    this.form.controls.due.disable();
    this.form.controls.minimumLevel.disable();
    this.form.controls.barcodeNumber.disable();
    this.form.controls.purchasePrice.disable();
    this.form.controls.retailPrice.disable();
    this.form.controls.taxRate.disable();
    this.form.controls.postalServiceId.disable();
    this.form.controls.categoryId.disable()
    this.form.controls.packageGroupId.disable();
    this.form.controls.height.disable();
    this.form.controls.width.disable();
    this.form.controls.depth.disable();
    this.form.controls.weight.disable();
    this.form.controls.batchNumberScanRequired.disable();
    this.form.controls.serialNumberScanRequired.disable();
    this.form.controls.postage.disable();
    this.form.controls.shipping.disable()
  }
  enableAllFields(){
    this.form.controls.imageUrl.enable()
    this.form.controls.itemTitle.enable();
    this.form.controls.itemNumber.enable();
    this.form.controls.quantity.enable();
    this.form.controls.openOrder.enable();
    this.form.controls.available.enable();
    this.form.controls.due.enable();
    this.form.controls.minimumLevel.enable();
    this.form.controls.barcodeNumber.enable();
    this.form.controls.purchasePrice.enable();
    this.form.controls.retailPrice.enable();
    this.form.controls.taxRate.enable();
    this.form.controls.postalServiceId.enable();
    this.form.controls.categoryId.enable()
    this.form.controls.packageGroupId.enable();
    this.form.controls.height.enable();
    this.form.controls.width.enable();
    this.form.controls.depth.enable();
    this.form.controls.weight.enable();
    this.form.controls.batchNumberScanRequired.enable();
    this.form.controls.serialNumberScanRequired.enable();
    this.form.controls.postage.enable();
    this.form.controls.shipping.enable()
  }
  skuSubscribe(){
    this.inventoryService.getSkuDetails(this.itemId).subscribe((resSku:any[])=>{
                //ItemTitle:
      if(resSku.length === 0){
        this.soundsService.playError();
        this.form.reset();
        this.showButton = false;
        this.suppliers = [];
        this.imagePath = null;
        this.disableAllFields();
        return;
      }
      else{
        this.showButton = true;
        let initialSkuDetails = {
          imageUrl: '',
          itemTitle: resSku[0].ItemTitle,
          itemNumber: resSku[0].ItemNumber,
          available: resSku[0].Available,
          quantity: resSku[0].Quantity,
          openOrder:resSku[0].InOrder,
          due: resSku[0].Due,
          minimumLevel: resSku[0].MinimumLevel,
          barcodeNumber: resSku[0].BarcodeNumber,
          purchasePrice: resSku[0].PurchasePrice,
          retailPrice: resSku[0].RetailPrice,
          taxRate:resSku[0].TaxRate,
          postalServiceId: resSku[0].PostalServiceId,
          categoryId: resSku[0].CategoryId,
          packageGroupId: resSku[0].PackageGroupId,
          height: '',
          width: '',
          depth:'',
          weight: '',
          shipping: '',
          postage: '',
          imagePath: '',
          batchNumberScanRequired:resSku[0].BatchNumberScanRequired,
          serialNumberScanRequired: resSku[0].SerialNumberScanRequired      
        }
        this.itemStockId = resSku[0].StockItemId;

        this.inventoryService.setSkuDetails({...this.skuDetails, ...initialSkuDetails});
        this.inventoryService.getItemDetails()
          .subscribe((res:any)=>{
            let dimentionsData = res.Data.filter(data=>{
              return data.StockItemId === this.itemStockId;
            });

            if(dimentionsData.length > 0){
              this.inventoryService.setSkuDetails({
                ...this.skuDetails,
                height: dimentionsData[0].Height,
                width: dimentionsData[0].Width,
                depth:dimentionsData[0].Depth,
                weight: dimentionsData[0].Weight,
              });
            }
            
            
          })
        this.inventoryService.getItemImage(this.itemStockId)
          .subscribe((img:any[])=>{
            if(img.length > 0){
             
              this.imagePath = img[0].FullSource;
              this.inventoryService.setSkuDetails({...this.skuDetails, imagePath: this.imagePath});
            }
            else{
              this.imagePath = null;
              this.inventoryService.setSkuDetails({...this.skuDetails, imagePath: this.imagePath});
            }
          })

          this.inventoryService.getInventoryItemExtendedProperties(this.itemStockId)
            .subscribe((propRes:any[])=>{
              console.log(propRes)
              if(propRes.length > 0){
               
                propRes.forEach(prop=>{
                  if(prop.ProperyName === "Postage"){
                    this.postageExtendedProp = prop;
                  }
                  else if(prop.ProperyName === "Shipping"){
                    this.shippingExtendedProp = prop;
                  }
                })
                this.inventoryService.setSkuDetails({...this.skuDetails, postage:this.postageExtendedProp.PropertyValue, shipping:this.shippingExtendedProp.PropertyValue});
              }
              else{
                this.inventoryService.setSkuDetails({...this.skuDetails, postage:null, shipping:null});
              }
          })
          this.form.setValue({
            imageUrl: this.skuDetails.imageUrl,
            itemTitle: this.skuDetails.itemTitle,
            itemNumber: this.skuDetails.itemNumber,
            quantity: this.skuDetails.quantity,
            openOrder: this.skuDetails.openOrder,
            available: this.skuDetails.available,
            due: this.skuDetails.due,
            minimumLevel: this.skuDetails.minimumLevel,
            barcodeNumber: this.skuDetails.barcodeNumber,
            purchasePrice: this.skuDetails.purchasePrice,
            retailPrice: this.skuDetails.retailPrice,
            taxRate: this.skuDetails.taxRate,
            postalServiceId: this.skuDetails.postalServiceId,
            categoryId: this.skuDetails.categoryId,
            packageGroupId: this.skuDetails.packageGroupId,
            height: this.skuDetails.height,
            width: this.skuDetails.width,
            depth: this.skuDetails.depth,
            weight: this.skuDetails.weight,
            postage: this.skuDetails.postage,
            shipping: this.skuDetails.shipping,
            batchNumberScanRequired: this.skuDetails.batchNumberScanRequired,
            serialNumberScanRequired: this.skuDetails.serialNumberScanRequired,
            image: null,
          });
        this.inventoryService.getSuppliers(this.itemStockId)
          .subscribe(suppliers=>{
            this.suppliers = suppliers;
            this.inventoryService.setSuppliers(this.suppliers);
          })
        this.disableAllFields();
      }
    
    });
  }
  ngOnInit() {

    this.skuDetailsSub = this.inventoryService.getSkuDetailsUpdateListener()
      .subscribe((skuRes)=>{
        this.skuDetails = skuRes;
        this.form.setValue({
          imageUrl: '',
          itemTitle: this.skuDetails.itemTitle,
          itemNumber: this.skuDetails.itemNumber,
          quantity: this.skuDetails.quantity,
          openOrder: this.skuDetails.openOrder,
          available: this.skuDetails.available,
          due: this.skuDetails.due,
          minimumLevel: this.skuDetails.minimumLevel,
          barcodeNumber: this.skuDetails.barcodeNumber,
          purchasePrice: this.skuDetails.purchasePrice,
          retailPrice: this.skuDetails.retailPrice,
          taxRate: this.skuDetails.taxRate,
          postalServiceId: this.skuDetails.postalServiceId,
          categoryId: this.skuDetails.categoryId,
          packageGroupId: this.skuDetails.packageGroupId,
          height: this.skuDetails.height,
          width: this.skuDetails.width,
          depth: this.skuDetails.depth,
          weight: this.skuDetails.weight,
          postage: this.skuDetails.postage,
          shipping: this.skuDetails.shipping,
          batchNumberScanRequired: this.skuDetails.batchNumberScanRequired,
          serialNumberScanRequired: this.skuDetails.serialNumberScanRequired,
          image: null
        });
      });

    this.form = new FormGroup({
      imageUrl: new FormControl(null, Validators.required),
      itemTitle: new FormControl(null, Validators.required),
      itemNumber: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
      openOrder: new FormControl(null, Validators.required),
      available: new FormControl(null, Validators.required),
      due: new FormControl(null, Validators.required),
      minimumLevel: new FormControl(null, Validators.required),
      barcodeNumber: new FormControl(null, Validators.required),
      purchasePrice: new FormControl(null, Validators.required),
      retailPrice: new FormControl(null, Validators.required),
      taxRate: new FormControl(null, Validators.required),
      postalServiceId: new FormControl(null, Validators.required),
      categoryId: new FormControl(null, Validators.required),
      packageGroupId: new FormControl(null, Validators.required),
      height: new FormControl(null, Validators.required),
      width: new FormControl(null, Validators.required),
      depth: new FormControl(null, Validators.required),
      weight: new FormControl(null, Validators.required),
      batchNumberScanRequired: new FormControl(null, Validators.required),
      serialNumberScanRequired: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      postage: new FormControl(null, Validators.required),
      shipping: new FormControl(null, Validators.required),
      
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
              this.tokenSub = this.tokenService.tokenUpdateListener().subscribe(a=>{
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
    this.enableAllFields();
   
  }
  cancel(){
    this.editMode = false;
    this.disableAllFields();
  }

  save(){
    let imageUrl = this.form.value.imageUrl.trim();
    let itemTitle = this.form.value.itemTitle;
    let itemNumber = this.form.value.itemNumber;
    let quantity = this.form.value.quantity;
    let openOrder = this.form.value.openOrder;
    let available = this.form.value.available;
    let due = this.form.value.due;
    let minimumLevel = this.form.value.minimumLevel;
    let barcodeNumber = this.form.value.barcodeNumber;
    let purchasePrice = this.form.value.purchasePrice;
    let retailPrice = this.form.value.retailPrice;
    let taxRate = this.form.value.taxRate;
    let postalServiceId = this.form.value.postalServiceId;
    let categoryId = this.form.value.categoryId
    let packageGroupId = this.form.value.packageGroupId;
    let height = this.form.value.height;
    let width = this.form.value.width;
    let depth = this.form.value.depth;
    let weight = this.form.value.weight;
    let batchNumberScanRequired = this.form.value.batchNumberScanRequired;
    let serialNumberScanRequired = this.form.value.serialNumberScanRequired;

    let postage = {...this.postageExtendedProp, PropertyValue: this.form.value.postage}
    let shipping = {...this.shippingExtendedProp, PropertyValue: this.form.value.shipping}
    
    let details = {
      itemTitle,
      itemNumber,
      quantity,
      openOrder,
      available,
      due,
      minimumLevel,
      barcodeNumber,
      purchasePrice,
      retailPrice,
      taxRate,
      postalServiceId,
      categoryId,
      packageGroupId,
      height,
      width,
      depth,
      weight,
      batchNumberScanRequired,
      serialNumberScanRequired
    };
    this.inventoryService.updateInventoryItem(details,this.itemStockId).subscribe(a=>{
      if(a === null){
        // if(this.form.value.image){
        //   this.inventoryService.upload(this.form.value.image, this.itemStockId);
        // }

        this.inventoryService.updateInventoryItemExtendedProperties([shipping,postage])
          .subscribe(a=>{
            this.soundsService.playSuccess();
            this.skuSubscribe()
          })
        this.inventoryService.uploadImageToLinn(imageUrl,this.itemStockId)
          .subscribe(imageUpload=>{
            console.log(imageUpload);
            this.skuSubscribe();
          })
        
        
        
        this.editMode = false;
      }
    })
  }

  // onImagePicked(event: Event){
  //   console.log('onPick')
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.form.patchValue({image: file});
  //   this.form.get('image').updateValueAndValidity();
  // }



  ngOnDestroy(){
    this.skuDetailsSub.unsubscribe();
    if(this.tokenSub){
      this.tokenSub.unsubscribe();
    }
    
  }

}
