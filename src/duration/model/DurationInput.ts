import { DurationMask, DurationMaskService } from './DurationMask';
import { durationMaskOptions, DurationMaskOption } from './DurationMaskOption';
import { Duration, DuratoinPart } from './Duration';

export const defaultMask: DurationMask = [durationMaskOptions.hour, durationMaskOptions.minute, durationMaskOptions.second];

export class DurationInput {
    private _reversedMask: DurationMask;
    private _digits: number[];

    constructor(durationMask?: DurationMask, initialValue?: Duration) {
        this._reversedMask = (durationMask || defaultMask).reverse();
        this._digits = !initialValue ? [0, 0, 0, 0, 0, 0, 0, 0, 0] : initialValue.reduce<number[]>((digits, durationPart) => {
            const partDigits: number[] = durationPart.value.toString().split('').map(x => Number(x));
            digits.push(...partDigits);
            return digits;
        }, []);
    }


    public set digits(newDigits: number[]) {
        this._digits = newDigits;
    }


    nextDigit(nextDigit: number) {
        this._digits.push(nextDigit);
    }

    removeLastDigit() {
        this._digits.pop();
    }

    toString(): string {
        const safeDigits = [...this._digits];
        let displayText = '';

        for (const maskOption of this._reversedMask) {
            displayText = maskOption.suffix + displayText;
            const digitAmount = maskOption.maxValue.toString().length;
            for (const iterator of Array(digitAmount)) {
                displayText = (safeDigits.pop() || 0) + displayText;
            }
            displayText = ' ' + displayText;
        }
        return displayText.slice(1); // remove prefixing front space
    }

    toDuration(): Duration {
        const safeDigits = [...this._digits];
        let duration: Duration = [];

        for (const maskOption of this._reversedMask) {
            const digitAmount = maskOption.maxValue.toString().length;
            const durationPart: DuratoinPart = {
                suffix : maskOption.suffix,
                value : Number(safeDigits.splice(-digitAmount).toString().replace(/\D+/g, ''))
            };
            duration = [durationPart, ...duration];
        }
        return duration;
    }

    formatDigits(): number[] {
        const maskDigitAmount = DurationMaskService.getDigitAmount(this._reversedMask);
        let formattedDigits: number[] = [];
        let carry = 0;

        this._reversedMask.forEach((maskOption: DurationMaskOption) => {
            const digitAmount = maskOption.maxValue.toString().length;
            const inputtedValue: number = Number(this._digits.splice(-digitAmount).toString().replace(/\D+/g, '')) + carry;
            const formattedValue: number = inputtedValue % maskOption.maxValue;
            carry = Math.floor(inputtedValue / maskOption.maxValue);
            formattedDigits = [
                ...formattedValue.toString().padStart(digitAmount, '0').split('').map(digit => Number(digit)),
                ...formattedDigits
            ];
        });

        this._digits.push(...formattedDigits);
        return this._digits;
    }
}
