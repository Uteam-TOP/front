import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DiscussionsRoutingModule} from "./discussions-routing.module";
import {DiscussionsComponent} from "./discussions.component";
import {RouterOutlet} from "@angular/router";



@NgModule({
  declarations: [DiscussionsComponent],
  imports: [
    CommonModule,
    DiscussionsRoutingModule,
    RouterOutlet
  ]
})
export class DiscussionsModule { }
