import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jv-panel-tabs',
  templateUrl: './panel-tabs.component.html',
  styleUrls: ['./panel-tabs.component.scss'],
})
export class PanelTabsComponent {
  constructor() {}

  openCity(cityName: string): void {
    // Get all elements with class "city" and hide them
    const cities = document.getElementsByClassName("city");
    
    for (let i = 0; i < cities.length; i++) {
      Array.from(cities).forEach((element: Element) => {
        (element as HTMLElement).style.display = "none";
        console.log(HTMLElement)
      });
    }

    // Show the content related to the selected city
    const selectedCity = document.getElementById(cityName);
    if (selectedCity) {
      selectedCity.style.display = "block";
    }
  }
}
