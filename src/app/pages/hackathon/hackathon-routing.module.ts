import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {HackathonComponent} from "./hackathon.component";
import {AuthGuard} from "../../components/personal-account/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: HackathonComponent,
    children: [
      {
        path: '',
        redirectTo: 'create',
        pathMatch: 'full'
      },
      {
        path: 'create',
        loadComponent: () => import('./create-edit-hackathon/create-edit-hackathon.component').then(m => m.CreateEditHackathonComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./create-edit-hackathon/create-edit-hackathon.component').then(m => m.CreateEditHackathonComponent),
        canActivate: [AuthGuard]
      },
      {
        path: ':id',
        loadComponent: () => import('./hackathon-page/hackathon-page.component').then(m => m.HackathonPageComponent)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HackathonRoutingModule {}
