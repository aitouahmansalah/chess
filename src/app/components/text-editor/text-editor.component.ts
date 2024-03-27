/* eslint-disable max-len, padded-blocks, prefer-const */
import { Component } from '@angular/core';

declare var html2pdf: any;

@Component({
  selector: 'jv-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent {

  constructor() { }

  formatDoc(cmd: string, value: any = null): void {
    const content = document.getElementById('content');
    content?.focus();

    if (content) {
      if (value) {
        document.execCommand(cmd, false, value);
      } else {
        document.execCommand(cmd);
      }
    }
  }

  addLink(): void {
    const url = prompt('Insert url');
    if (url) {
      this.formatDoc('createLink', url);
    }
  }

  showCode(): void {
    const content = document.getElementById('content');
    let active = false;

    if (content) {
      if (active) {
        content.textContent = content.innerHTML;
        content.setAttribute('contenteditable', 'false');
      } else {
        content.innerHTML = content.textContent ?? '';
        content.setAttribute('contenteditable', 'true');
      }

      active = !active;
    }
  }

  fileHandle(value: string): void {
    const content = document.getElementById('content');
    const filenameInput = document.getElementById('filename') as HTMLInputElement;
    
    if (content && filenameInput) {
      const filename = filenameInput.value || 'untitled' as string; 
  
      if (value === 'new') {
        content.innerHTML = '';
      } else if (value === 'txt') {
        const blob = new Blob([content.innerText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.txt`;
        link.click();
      } else if (value === 'pdf') {
        html2pdf().from(content).save(filename);
      }
    }
  }  

}
