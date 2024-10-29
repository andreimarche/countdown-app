import { Component } from '@angular/core'
import { CountDownComponent } from './components/countdown/countdown.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CountDownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'FrontendChallenge'
}
