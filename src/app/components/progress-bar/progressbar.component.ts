import { Component, Input, OnInit } from '@angular/core';
import { NxProgressbarModule } from '@aposin/ng-aquila/progressbar';

@Component({
  selector: 'app-progressbar',
  imports: [NxProgressbarModule],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.scss',
})
export class ProgressbarComponent implements OnInit {
  @Input() currentPath = 1;
  @Input() totalPath = 10;

  min = 0;

  ngOnInit(): void {}

  getCompletedPercentage() {
    return Math.round((this.currentPath / this.totalPath) * 100);
  }
}
