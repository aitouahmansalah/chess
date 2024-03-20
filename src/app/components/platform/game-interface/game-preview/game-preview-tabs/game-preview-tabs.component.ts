/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jv-game-preview-tabs',
  templateUrl: './game-preview-tabs.component.html',
  styleUrls: ['./game-preview-tabs.component.scss'],
})
export class GamePreviewTabsComponent { 
  opendTab:string = 'game';
  constructor() {}

  changeTab(tabName:string):void {
    this.opendTab = tabName;
  }
  openCity(cityName: string): void {
    // Get all elements with class "city" and hide them
    const cities = document.getElementsByClassName("city");
    const tabs = document.querySelectorAll("button");
    
    for (let i = 0; i < cities.length; i++) {
      Array.from(cities).forEach((element: Element) => {
        (element as HTMLElement).style.display = "none";
      });

      Array.from(tabs).forEach((element: Element) => {
        (element as HTMLElement).style.backgroundColor = "rgb(33,32,29)";
      });
    }

    // Show the content related to the selected city
    const selectedCity = document.getElementById(cityName);
    const tabButton = document.querySelector(`button.${cityName}`) as HTMLButtonElement;
    if (selectedCity) {
      selectedCity.style.display = "block";
    }
    if (tabButton) {
      tabButton.style.backgroundColor = "rgb(38,37,34)";
    }
  }

}
