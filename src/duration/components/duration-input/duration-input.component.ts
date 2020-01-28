import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { DurationMask } from 'src/duration/model/DurationMask';
import { durationMaskOptions } from 'src/duration/model/DurationMaskOption';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-duration-input',
  templateUrl: './duration-input.component.html',
  styleUrls: ['./duration-input.component.scss']
})
export class DurationInputComponent implements OnInit {

  // reversed to start iterating digits from the back so input that overflows digits[] isn't accounted for
  private reversedMask: DurationMask;
  private digits: number[];
  private displayText = new FormControl('');

  constructor(private changeDetector: ChangeDetectorRef) {}

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

  nextDigit(nextDigit: number) {
    this.digits.push(nextDigit);
  }

  removeLastDigit() {
      this.digits.pop();
  }

  refreshDisplayValue() {
    this.displayText.setValue(this.getDisplayText());
  }

  getDisplayText(): string {
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
    return displayText.slice(1); // remove prefixing front space
  }
}

function isInsertEvent(event: any): boolean {
  // inputTypes as defined by mozilla docs https://rawgit.com/w3c/input-events/v1/index.html#interface-InputEvent-Attributes
  const insertEventTypes: string[] = [
    'insertText'
  ];

  return insertEventTypes.includes(event.inputType);
}

function isDeleteEvent(event: any): boolean {
  // inputTypes as defined by mozilla docs https://rawgit.com/w3c/input-events/v1/index.html#interface-InputEvent-Attributes
  const deleteEventTypes: string[] = [
    'deleteContentBackward'
  ];

  return deleteEventTypes.includes(event.inputType);
}
