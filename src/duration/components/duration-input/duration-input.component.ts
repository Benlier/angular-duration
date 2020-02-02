import { Component, OnInit, ChangeDetectorRef, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { DurationMask } from 'src/duration/model/DurationMask';
import { durationMaskOptions } from 'src/duration/model/DurationMaskOption';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DurationInput } from 'src/duration/model/DurationInput';
import { Duration } from 'src/duration/model/Duration';

@Component({
  selector: 'app-duration-input',
  templateUrl: './duration-input.component.html',
  styleUrls: ['./duration-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DurationInputComponent),
      multi: true
    }
  ]
})
export class DurationInputComponent implements OnInit, ControlValueAccessor	 {

  private duration: DurationInput;
  private displayText: FormControl;
  private onChange: (newValue: Duration) => void;

  ngOnInit(@Input() initialValue?: Duration, @Input() durationMask?: DurationMask) {
    const defaultMask: DurationMask = [durationMaskOptions.hour, durationMaskOptions.minute, durationMaskOptions.second];
    this.duration = new DurationInput(durationMask || defaultMask, initialValue);
    this.displayText = new FormControl(this.duration.toString());
  }

  writeValue(digits: number[]): void {
    this.duration.digits = digits;
    this.refreshDisplayValue();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  refreshDisplayValue() {
    this.displayText.setValue(this.duration.toString());
  }

  // UIEvents-------------------------------------------

  onInputEvent(event: any) {
    if (isInsertEvent(event)) {
      if (!isNaN(Number(event.data))) {
        this.duration.nextDigit(event.data);
      }
    }
    if (isDeleteEvent(event)) {
      this.duration.removeLastDigit();
    }
    this.refreshDisplayValue();
  }

  onPasteEvent(event: any) {
    const pastedText = event.clipboardData.getData('text');
    const newNumbers = pastedText.replace(/\D+/g, '');

    newNumbers.split('').forEach((newNumber: number) => {
      this.duration.nextDigit(newNumber);
    });

    this.refreshDisplayValue();
  }

  onDeselectEvent() {
    this.duration.formatDigits();
    this.refreshDisplayValue();
    this.onChange(this.duration.toDuration());
  }


}

function isInsertEvent(event: any): boolean {
  // inputTypes as defined by mozilla docs https://rawgit.com/w3c/input-events/v1/index.html#interface-InputEvent-Attributes
  const insertEventTypes: string[] = ['insertText'];
  return insertEventTypes.includes(event.inputType);
}

function isDeleteEvent(event: any): boolean {
  // inputTypes as defined by mozilla docs https://rawgit.com/w3c/input-events/v1/index.html#interface-InputEvent-Attributes
  const deleteEventTypes: string[] = ['deleteContentBackward'];
  return deleteEventTypes.includes(event.inputType);
}
