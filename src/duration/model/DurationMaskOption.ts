export interface DurationMaskOption {
    maxValue: number;
    suffix: string;
}

type durationMaskOptionKeys = 'hour' | 'minute' | 'second';

export const durationMaskOptions: Record<durationMaskOptionKeys, DurationMaskOption> = {
'hour' : {maxValue: 24, suffix: 'h'},
'minute' : {maxValue: 60, suffix: 'm'},
'second' : {maxValue: 60, suffix: 's'},
};
