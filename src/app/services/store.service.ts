import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

import { Car } from '../models';
import { ParkingLotService } from './parking-lot.service';

export const enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface ErrorState {
  errorMsg: string;
}

export type CallState = LoadingState | ErrorState;

interface ParkingState {
  cars: Car[];
  callState: CallState;
}

function isErrorState(callState: CallState): callState is ErrorState {
  return !!(callState as ErrorState).errorMsg;
}

function getError(callState: CallState): ErrorState['errorMsg'] | null {
  if (isErrorState(callState)) {
    return callState.errorMsg;
  }

  return null;
}

@Injectable()
export class StoreService extends ComponentStore<ParkingState> {
  private readonly cars$: Observable<Car[]>;
  private readonly loading$: Observable<boolean>;
  private readonly error$: Observable<string | null>;
  readonly vm$: Observable<{ cars: Car[]; loading: boolean; error: string }>;

  constructor(private parkingLotService: ParkingLotService) {
    super({
      cars: [],
      callState: LoadingState.INIT,
    });

    this.cars$ = this.select((state) => state.cars);
    this.loading$ = this.select(
      (state) => state.callState === LoadingState.LOADING
    );
    this.error$ = this.select((state) => getError(state.callState));
    this.vm$ = this.select(
      this.cars$,
      this.loading$,
      this.error$,
      (cars, loading, error) => ({ cars, loading, error })
    );
  }
}
