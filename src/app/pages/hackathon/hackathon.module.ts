import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HackathonRoutingModule} from "./hackathon-routing.module";
import {HackathonComponent} from "./hackathon.component";
import {RouterOutlet} from "@angular/router";

@NgModule({
  declarations: [
    HackathonComponent
  ],
  imports: [
    CommonModule,
    HackathonRoutingModule,
    RouterOutlet
  ]
})
export class HackathonModule { }
