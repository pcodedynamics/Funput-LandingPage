import { Component } from '@angular/core';
import { FUNPUT_CONSTANTS } from '../../constants';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
})
export class HeaderComponent {
  protected readonly constants = FUNPUT_CONSTANTS;
}
