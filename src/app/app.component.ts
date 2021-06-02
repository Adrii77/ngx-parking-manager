import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { StoreService } from './services/store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  providers: [StoreService],
})
export class AppComponent {
  vm$: Observable<any>;
  plate: string;
  plates: string[];

  constructor(private store: StoreService) {
    this.vm$ = store.vm$;
    this.plate = '';
    this.plates = ['2FMDK3', '1GYS4C', '1GKS1E', '1G6AS5'];
  }

  onSubmit($event: Event): void {
    $event.preventDefault();
    this.store.addCarToParkingLot(this.plate);
    this.plate = '';
  }

  addPlate(plate: string): void {
    this.plate = plate;
  }
}
