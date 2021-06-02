import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { Car } from '../models';
import { ParkingLotService } from './parking-lot.service';

export const enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  FAILED = 'FAILED',
}

interface ParkingState {
  cars: Car[];
  error: string;
  callState: LoadingState;
}

@Injectable()
export class StoreService extends ComponentStore<ParkingState> {
  constructor(private parkingLotService: ParkingLotService) {
    super({
      cars: [],
      error: '',
      callState: LoadingState.INIT,
    });
  }
  /**
   * SELECTORS
   */
  private readonly cars$: Observable<Car[]> = this.select(
    (state) => state.cars
  );
  private readonly loading$: Observable<boolean> = this.select(
    (state) => state.callState === LoadingState.LOADING
  );
  private readonly error$: Observable<string> = this.select(
    (state) => state.error
  );

  readonly vm$: Observable<{
    cars: Car[];
    loading: boolean;
    error: string;
  }> = this.select(
    this.cars$,
    this.loading$,
    this.error$,
    (cars, loading, error) => ({ cars, loading, error })
  );

  /**
   * UPDATERS
   */
  readonly updateError = this.updater((state: ParkingState, error: string) => {
    return {
      ...state,
      callState: LoadingState.FAILED,
      error,
    };
  });

  readonly setLoading = this.updater((state: ParkingState) => {
    return {
      ...state,
      callState: LoadingState.LOADING,
    };
  });

  readonly setLoaded = this.updater((state: ParkingState) => {
    return {
      ...state,
      callState: LoadingState.LOADED,
    };
  });

  readonly updateCars = this.updater((state: ParkingState, car: Car) => {
    return {
      ...state,
      error: '',
      cars: [...state.cars, car],
    };
  });

  /**
   * Effects
   */

  readonly addCarToParkingLot = this.effect((plate$: Observable<string>) => {
    return plate$.pipe(
      concatMap((plate: Car['plate']) => {
        this.setLoading();
        return this.parkingLotService.add(plate).pipe(
          tapResponse(
            (car) => {
              this.setLoaded();
              this.updateCars(car);
            },
            (error) => this.updateError(error as string)
          )
        );
      })
    );
  });
}
