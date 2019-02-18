import { NgModule } from "../../node_modules/@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrderComponent } from "./order/order.component";
import { InventoryComponent } from "./inventory/inventory.component";
import { InventoryDetailComponent } from "./inventory/inventory-detail/inventory-detail.component";
import { SettingsComponent } from "./settings/settings.component";
import { LoginComponent } from "./auth/login/login.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./auth/auth.guard";
import { InventoryWithProvidersComponent } from "./inventory/inventory-with-providers/inventory-with-providers.component";


const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'setting', component: SettingsComponent, canActivate: [AuthGuard]},
    { path: 'pos', component: OrderComponent, canActivate: [AuthGuard]},
    { path: 'sku', component: InventoryComponent,
    children: [
      { path: '', component: InventoryDetailComponent },
      { path: ':itemId', component: InventoryDetailComponent },
    ], canActivate: [AuthGuard]
  },
  { path: 'providers', component: InventoryComponent,
    children: [
      { path: '', component: InventoryWithProvidersComponent },
      { path: ':itemId', component: InventoryWithProvidersComponent },
    ], canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent},
    
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}