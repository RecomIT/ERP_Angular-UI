import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-panel',
  template: `<router-outlet></router-outlet>`,

})
export class ControlPanelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
