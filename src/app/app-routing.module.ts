import { NgModule } from "../../node_modules/@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrderComponent } from "./order/order.component";


const routes: Routes = [
    { path: '', component: OrderComponent},
    
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}