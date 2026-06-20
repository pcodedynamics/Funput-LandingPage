import { Component } from '@angular/core';
import { FUNPUT_CONSTANTS } from '../../constants';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
})
export class FooterComponent {
  protected readonly constants = FUNPUT_CONSTANTS;
}
