import { Pipe, PipeTransform } from '@angular/core';
import { DurationService, Duration } from '../model/Duration';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(duration: Duration): string {
    console.log(duration);
    return DurationService.toString([...duration]);
  }

}
