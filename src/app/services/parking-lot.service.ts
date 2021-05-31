import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Car } from '../models';
import { carCollection } from './parking-lot.constant';

@Injectable({
  providedIn: 'root',
})
export class ParkingLotService {
  private cars: Car[];

  constructor() {
    this.cars = [];
  }

  add(plate: string): Observable<Car | never> {
    const existingCar = this.cars.find((car) => car.plate === plate);
    if (existingCar) {
      return throwError(`Car with plate ${plate} already exists`);
    }

    const car = this.getCarByPlate(plate);
    if (!car) {
      return throwError(`Car with plate ${plate} doesn't exist`);
    }
    this.cars = [...this.cars, car];

    return of(car).pipe(delay(600));
  }

  getCarByPlate(plate: string): Car | undefined {
    const car = carCollection.find((car) => car.plate === plate);

    return car;
  }
}
