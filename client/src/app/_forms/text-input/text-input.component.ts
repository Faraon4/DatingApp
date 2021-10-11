import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements ControlValueAccessor {

  // we want to implement here a control value accessor
  // If we look in the register.component.ts, we have there FormControls like username, password and cofrim password
  // And in this file we want to get access to them


  @Input() label!: string;
  @Input() type = 'text'; // this is default, and if we want to overide we pass to control


  // In constructor we inject the control in the ControlValueAccessor
  constructor(@Self() public ngControl: NgControl) {
    // by doing this , we get access to out control
    this.ngControl.valueAccessor = this;
   }
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

}
