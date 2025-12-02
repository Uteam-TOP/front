import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {HackathonsListComponent} from "./hackathons-list/hackathons-list.component";

const routes: Routes = [
  { path: '', component: HackathonsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HackathonsListRoutingModule { }
