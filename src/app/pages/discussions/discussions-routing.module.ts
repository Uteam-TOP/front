import {RouterModule, Routes} from "@angular/router";
import {HackathonComponent} from "../hackathon/hackathon.component";
import {NgModule} from "@angular/core";
import {AuthGuard} from "../../components/personal-account/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: HackathonComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'create',
        loadComponent: () => import('./create-post/create-post.component').then(m => m.CreatePostComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'list',
        loadComponent: () => import('./discussions-list/discussions-list.component').then(m => m.DiscussionsListComponent),
        canActivate: [AuthGuard]
      },
      {
        path: ':id',
        loadComponent: () => import('./discussion-post/discussion-post.component').then(m => m.DiscussionPostComponent),
        canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DiscussionsRoutingModule { }
