import { DurationInput } from './DurationInput';

describe(`DurationInput: when adding and removing some digits,
we get the correct string and Duration object before and after formatting`, () => {
    const SUT: DurationInput = new DurationInput();

    it('takes some input', () => {
        SUT.nextDigit(4);
        SUT.nextDigit(5);
        SUT.nextDigit(6);
        SUT.nextDigit(7);
        SUT.nextDigit(8);
        SUT.nextDigit(9);

        expect(SUT.toString()).toBe('45h 67m 89s');
        expect(SUT.toDuration()).toEqual([
            {suffix: 'h', value: 45},
            {suffix: 'm', value: 67},
            {suffix: 's', value: 89},
        ]);
    });

    it('removes the last digit', () => {
        SUT.removeLastDigit();

        expect(SUT.toString()).toBe('04h 56m 78s');
        expect(SUT.toDuration()).toEqual([
            {suffix: 'h', value: 4},
            {suffix: 'm', value: 56},
            {suffix: 's', value: 78},
        ]);
    });

    it('formats the duration correctly', () => {
        SUT.formatDigits();

        expect(SUT.toString()).toBe('04h 57m 18s');
        expect(SUT.toDuration()).toEqual([
            {suffix: 'h', value: 4},
            {suffix: 'm', value: 57},
            {suffix: 's', value: 18},
        ]);
    });

});
