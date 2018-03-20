import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-available-network-services',
  templateUrl: './available-network-services.component.html',
  styleUrls: ['./available-network-services.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AvailableNetworkServicesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  items = [
    'Finn the human',
    'Jake the dog',
    'Princess bubblegum',
    'Lumpy Space Princess',
    'Beemo1',
    'Beemo2'
  ]

}
