import { Component, Input } from '@angular/core';

/**
 * Generated class for the CourseCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'course-card',
  templateUrl: 'course-card.html'
})
export class CourseCardComponent {
  @Input("course") course: any;
  text: string;

  constructor() {
    console.log('Hello CourseCardComponent Component');
    this.text = 'Hello World';
  }

}
