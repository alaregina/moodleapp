import { Directive, ElementRef, Renderer, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[dynamic-col]'
})

export class DynamicColDirective implements OnInit {
  @Input('dynamic-col') value: string;

  constructor(private el: ElementRef, private _renderer: Renderer) { }

  ngOnInit() {
    this._renderer.setElementAttribute(this.el.nativeElement, 'col-' + this.value, '');
  }
}