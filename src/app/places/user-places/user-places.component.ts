import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  isFetching = signal(false);
  error = signal('');
  private placesServie = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  places = this.placesServie. loadedUserPlaces;

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesServie.loadUserPlaces()
      .subscribe({
        // next: (resData) => {
        //   // console.log(data.places);
        //   console.log(resData);
        //   // this.places.update((oldPlaces)=>resData)
        //   this.places.set(resData);
        // },
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
  onRemovePlace(place:Place){
  const subscription =  this.placesServie.removeUserPlace(place).subscribe();
    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe()
    })
  }
}
