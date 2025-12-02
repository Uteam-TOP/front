import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ResumeListComponent} from "./resume-list/resume-list.component";

const routes: Routes = [
  { path: '', component: ResumeListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeListRoutingModule { }
