import { NgModule } from "../../node_modules/@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrderComponent } from "./order/order.component";
import { InventoryComponent } from "./inventory/inventory.component";
import { InventoryDetailComponent } from "./inventory/inventory-detail/inventory-detail.component";
import { SettingsComponent } from "./settings/settings.component";


const routes: Routes = [
    { path: '', component: OrderComponent},
    { path: 'setting', component: SettingsComponent},
    { path: 'pos', component: OrderComponent},
    { path: 'sku', component: InventoryComponent,
    children: [
      { path: '', component: InventoryDetailComponent },
      { path: ':itemId', component: InventoryDetailComponent },
    ]
  },
    
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}