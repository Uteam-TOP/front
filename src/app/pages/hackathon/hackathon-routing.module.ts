import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {HackathonPageComponent} from "./hackathon-page/hackathon-page.component";
import {CreateEditHackathonComponent} from "./create-edit-hackathon/create-edit-hackathon.component";

const routes: Routes = [
  { path: ':id', component: HackathonPageComponent },
  { path: 'edit/:id', component: CreateEditHackathonComponent },
  { path: 'create', component: CreateEditHackathonComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HackathonRoutingModule {}
