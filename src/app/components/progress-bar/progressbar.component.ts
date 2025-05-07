import {Component, Input, OnInit} from '@angular/core';
import {NxProgressbarModule} from '@aposin/ng-aquila/progressbar';

@Component({
  selector: 'app-progressbar',
  imports: [NxProgressbarModule],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.scss',
})
export class ProgressbarComponent implements OnInit {
  @Input() currentPath: number = 1;
  @Input() totalPath: number = 1;
  min: number = 0;

  ngOnInit(): void {}

  getCompletedPercentage() {
    return Math.round((this.currentPath / this.totalPath) * 100);
  }
}
