import { Directive, ElementRef } from "@angular/core";

declare var $: any;

@Directive({
  selector: '[icheck]'
})

export class IcheckDirective {
    $: any = $;
    constructor(el: ElementRef) {
         this.$(el.nativeElement).iCheck({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio_square-green'
        })
    }
}