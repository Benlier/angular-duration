import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'duration-value-accessor';
  duration = new FormControl([]);
  ngOnInit(): void {
    this.duration.valueChanges.subscribe(res => console.log(res));
  }
}
