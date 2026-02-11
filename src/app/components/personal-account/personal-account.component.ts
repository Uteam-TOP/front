import { Component, OnInit } from '@angular/core';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-personal-account',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './personal-account.component.html',
  styleUrl: './personal-account.component.css'
})
export class PersonalAccountComponent implements OnInit {


  ngOnInit(): void {

  }

 
}
