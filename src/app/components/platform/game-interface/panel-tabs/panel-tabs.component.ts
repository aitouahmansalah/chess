/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Socket } from 'socket.io-client';
import { User } from 'src/app/models/user.model';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'jv-panel-tabs',
  templateUrl: './panel-tabs.component.html',
  styleUrls: ['./panel-tabs.component.scss'],
})
export class PanelTabsComponent {
  opendTab:string = 'game';
  messages : {message : string , user : User , date : Date}[] = [];
  constructor(private socket : SocketService) {
    this.socket.onmessage().subscribe(mes => {
      if (!this.messages.find(msg => msg.message === mes.message && msg.date === mes.date)) {
        this.messages.push(mes);
      }
    });
  }

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
