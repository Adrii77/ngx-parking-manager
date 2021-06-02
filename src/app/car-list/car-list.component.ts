import { Component, Input } from '@angular/core';
import { Car } from '../models';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.sass'],
  providers: [],
})
export class CarListComponent {
  @Input() cars: Car[];

  constructor() {
    this.cars = [];
  }
}
