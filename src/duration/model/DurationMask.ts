import { DurationMaskOption } from './DurationMaskOption';

export type DurationMask = DurationMaskOption[];

export class DurationMaskService {
    static getDigitAmount(mask: DurationMask): number {
        return mask.reduce((sum: number, maskOption: DurationMaskOption) => sum += maskOption.maxValue, 0);
    }
}
