import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ConfigService } from '../services/config/config.service';

@Directive({
    selector: '[ifFeatureAvailable]'
})
export class FeatureAvailableDirective implements OnInit {
    @Input('ifFeatureAvailable')
    service: string;
    _element: ElementRef;
    constructor(el: ElementRef, private configService: ConfigService) {
        this._element = el;
    }

    ngOnInit() {
        const isServiceAvailable =
            this.configService.features_available.indexOf(
                this.service.toUpperCase()
            ) > -1
                ? true
                : false;
        if (!isServiceAvailable) {
            this._element.nativeElement.style.display = 'none';
        }
    }
}
