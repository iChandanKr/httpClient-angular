import { Place } from './../place.model';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.httpClient
      .get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(
        map((resData) => resData.places),
        catchError((error) => {
          console.log(error);
          return throwError(
            () =>
              new Error(
                'Something went wrong fetching the available places. Please try again later.'
              )
          );
        })
      )
      .subscribe({
        next: (resData) => {
          // console.log(data.places);
          console.log(resData);
          // this.places.update((oldPlaces)=>resData)
          this.places.set(resData);
        },
        complete: () => {
          this.isFetching.set(false); // this function run once when the next completed
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSelectPlace(selectedPlace: Place) {
    console.log(selectedPlace);
    this.httpClient.put('http://localhost:3000/user-places', {
      placeId: selectedPlace.id,
    }).subscribe({
      next:(data)=>{
        console.log(data)
      }
    });
  }
}
