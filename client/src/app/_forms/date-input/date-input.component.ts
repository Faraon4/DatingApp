import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements ControlValueAccessor {

  @Input() label!: string;
  @Input() maxDate!: Date;
  //When we use keyword Partial, it means that every single proprty inside the , BsDatepickerConfig (our case), are optional
  // we are using it, because we need to configure just some of the options, 
  // but without the Partial keyword, we must configure all properties inside the BsDatepickerConfig
  bsConfig?: Partial<BsDatepickerConfig>;
  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
    this.bsConfig = {
      containerClass: 'theme-red',
      dateInputFormat: 'DD MMMM YYYY'
    }
   }
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

  

}
