import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ProjectsListComponent} from "./projects-list/projects-list.component";

const routes: Routes = [
  { path: '', component: ProjectsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsListRoutingModule { }
