import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {AuthGuard} from "../../components/personal-account/auth.guard";
import {DiscussionsComponent} from "./discussions.component";

const routes: Routes = [
  {
    path: '',
    component: DiscussionsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'new',
        loadComponent: () => import('./create-post/create-post.component').then(m => m.CreatePostComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'list',
        loadComponent: () => import('./discussions-list/discussions-list.component').then(m => m.DiscussionsListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./discussion-post/discussion-post.component').then(m => m.DiscussionPostComponent)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DiscussionsRoutingModule { }
