import { Component, OnInit, ChangeDetectorRef, Input, forwardRef } from '@angular/core';
import { DurationMask } from 'src/duration/model/DurationMask';
import { durationMaskOptions, DurationMaskOption } from 'src/duration/model/DurationMaskOption';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  constructor(private changeDetector: ChangeDetectorRef) {}
  // reversed to start iterating digits from the back so input that overflows digits[] isn't accounted for
  private reversedMask: DurationMask;
  private digits: number[];
  private displayText = new FormControl('');
  writeValue(digits: number[]): void {
    console.log(digits);
    this.digits = digits;
    this.refreshDisplayValue();
    this.displayText.setValue(this.toString());
  }

  private propagateChange = (_: any) => {};
  registerOnChange(fn: any): void {
    this.propagateChange(fn);
  }

  private propagateTouched = (_: any) => {};
  registerOnTouched(fn: any): void {
    this.propagateTouched(fn);
  }


  ngOnInit(@Input() durationMask?: DurationMask, @Input() initialValue?: number) {
    const defaultMask: DurationMask = [durationMaskOptions.hour, durationMaskOptions.minute, durationMaskOptions.second];
    this.reversedMask = (durationMask || defaultMask).reverse();
    this.digits = initialValue ? initialValue.toString().split('').map(x => Number(x)) : [];
    this.refreshDisplayValue();
  }

  onInputEvent(event: any) {
    if (isInsertEvent(event)) {
      if (!isNaN(Number(event.data))) {
        this.nextDigit(event.data);
      }
    }
    if (isDeleteEvent(event)) {
      this.removeLastDigit();
    }
    this.refreshDisplayValue();
  }

  onPasteEvent(event: any) {
    const pastedText = event.clipboardData.getData('text');
    const newNumbers = pastedText.replace(/\D+/g, '');

    this.digits = [];
    newNumbers.split('').forEach((newNumber: number) => {
      this.nextDigit(newNumber);
    });

    this.refreshDisplayValue();
  }

  onDeselectEvent() {
    this.digits = formatDigits(this.digits, this.reversedMask);
    this.refreshDisplayValue();
    this.propagateChange(this.digits);
  }

  nextDigit(nextDigit: number) {
    this.digits.push(nextDigit);
  }

  removeLastDigit() {
      this.digits.pop();
  }

  refreshDisplayValue() {
    this.displayText.setValue(this.toString());
  }

  toString(): string {
    const safeDigits = [...this.digits];
    let displayText = '';

    for (const maskOption of this.reversedMask) {
        displayText = maskOption.suffix + displayText;
        const digitAmount = maskOption.maxValue.toString().length;
        for (const iterator of Array(digitAmount)) {
            displayText = (safeDigits.pop() || 0) + displayText;
        }
        displayText = ' ' + displayText;
    }
    return displayText; // remove prefixing front space
  }
}

function formatDigits(digits: number[], reversedMask: DurationMask): number[] {
  const maskDigitAmount = inferMaskDigitAmount( reversedMask);
  let formattedDigits: number[] = [];
  let carry = 0;

  reversedMask.forEach((maskOption: DurationMaskOption) => {
    const digitAmount = maskOption.maxValue.toString().length;
    const inputtedValue: number = Number(digits.splice(-digitAmount).toString().replace(/\D+/g, '')) + carry;
    const formattedValue: number = inputtedValue % maskOption.maxValue;
    carry = Math.floor(inputtedValue / maskOption.maxValue);
    formattedDigits = [...formattedValue.toString().padStart(digitAmount, '0').split('').map(digit => Number(digit)), ...formattedDigits];
  });

  digits.push(...formattedDigits);
  return digits;
}

function inferMaskDigitAmount(mask: DurationMask): number {
  return mask.reduce((sum: number, maskOption: DurationMaskOption) => sum += maskOption.maxValue, 0);
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
