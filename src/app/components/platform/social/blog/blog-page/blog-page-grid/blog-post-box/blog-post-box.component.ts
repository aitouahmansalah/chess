/* eslint-disable prefer-template */
/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jv-blog-post-box',
  templateUrl: './blog-post-box.component.html',
  styleUrls: ['./blog-post-box.component.scss'],
})
export class BlogPostBoxComponent {
  postFontSize: number;

  constructor() {
    const postElement = document.querySelector(".box .post");
    if (postElement) {
      this.postFontSize = parseFloat(window.getComputedStyle(postElement).fontSize);
    } else {
      throw new Error("No element with class 'post' found.");
    }
  }

  zoomIn():void{
    const postElement = document.querySelector(".post") as HTMLElement;
    if (postElement) {
      if (this.postFontSize < 31) {
        this.postFontSize += 2; 
        postElement.style.fontSize = this.postFontSize + "px";
      }
    }
  }
  zoomOut():void{
    const postElement = document.querySelector(".post") as HTMLElement;
    if (postElement) {
      if (this.postFontSize > 15) {
        this.postFontSize -= 2; 
        postElement.style.fontSize = this.postFontSize + "px";
      }
    }
  }
}
