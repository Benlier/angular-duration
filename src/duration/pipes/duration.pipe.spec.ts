import { DurationPipe } from './duration.pipe';
import { Duration } from '../model/Duration';

describe('DurationPipe', () => {
  it('create an instance', () => {
    const pipe = new DurationPipe();
    expect(pipe).toBeTruthy();
  });

  it('returns a duration as a string', () => {
    const testDuration: Duration = [
      {suffix: 'h', value: 4},
      {suffix: 'm', value: 56},
      {suffix: 's', value: 78},
    ];

    expect(new DurationPipe().transform(testDuration)).toBe('4h 56m 78s');
  });
});
