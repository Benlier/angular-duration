import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DurationInputComponent } from './components/duration-input/duration-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DurationPipe } from './pipes/duration.pipe';

@NgModule({
  declarations: [DurationInputComponent, DurationPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [DurationInputComponent]
})
export class DurationModule { }
