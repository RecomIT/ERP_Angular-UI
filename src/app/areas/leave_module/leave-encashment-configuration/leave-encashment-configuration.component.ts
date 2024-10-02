import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-leave-encashment-configuration',
  templateUrl: './leave-encashment-configuration.component.html',
  styleUrls: ['./leave-encashment-configuration.component.css']
})
export class LeaveEncashmentConfigurationComponent implements OnInit {


  encashmentForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.encashmentForm = this.fb.group({
      minServiceLength: [null],
      maxPercentage: [null],
      maxLeaves: [null],
      baseType: [],
      includeAllDays: [false],
      encashmentBasedOnRequest: [false]
    });
  }




}
