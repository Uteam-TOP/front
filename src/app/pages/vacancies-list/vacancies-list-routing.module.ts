import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {VacanciesListComponent} from "./vacancies-list/vacancies-list.component";

const routes: Routes = [
  { path: '', component: VacanciesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacanciesListRoutingModule { }
