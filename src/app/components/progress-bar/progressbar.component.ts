import { Component, Input, OnInit } from '@angular/core';
import { NxProgressbarModule } from '@aposin/ng-aquila/progressbar';

@Component({
  selector: 'app-progressbar',
  imports: [NxProgressbarModule],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.scss',
})
export class ProgressbarComponent implements OnInit {
  min = 0;
  currentPage = 9;
  totalPage = 10;

  ngOnInit(): void {}

  getCompletedPercentage() {
    return Math.round((this.currentPage / this.totalPage) * 100);
  }
}
