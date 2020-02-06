export type Duration = DuratoinPart[];

export interface DuratoinPart {
    value: number;
    suffix: string;
}

export class DurationService {
    static toString(duration: Duration): string {
        return duration.reduce<string>((text, part) => text += part.value + part.suffix + ' ', '').slice(0, -1);
    }
}


