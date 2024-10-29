import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Observable, interval } from 'rxjs'
import { map } from 'rxjs/operators'
import { FitTextModule } from '../../directives/fittext/fittext.module'

interface TimeLeftConstruct {
  secondsToDday: number
  minutesToDday: number
  hoursToDday: number
  daysToDday: number
}

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule, FormsModule, FitTextModule],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountDownComponent {
  public eventTitle: string | null
  public eventDate: Date
  public timeLeft$: Observable<TimeLeftConstruct>

  constructor() {
    this.eventTitle = localStorage.getItem('eventTitle') ?? 'my event'
    let currentDate = new Date()
    this.eventDate = new Date(
      localStorage.getItem('eventDate') ?? currentDate.setDate(currentDate.getDate() + 3),
    )
    this.timeLeft$ = interval(1000).pipe(
      map(() => {
        if (this.eventDate.getTime() < Date.now()) {
          return { daysToDday: 0, hoursToDday: 0, minutesToDday: 0, secondsToDday: 0 }
        } else {
          return calculateDateDiff(new Date(this.eventDate))
        }
      }),
    )
  }

  handleTitleChange(event: Event): void {
    this.eventTitle = (event.target as HTMLInputElement).value || null
    localStorage.setItem('eventTitle', this.eventTitle ?? '')
  }

  handleDateChange(event: Event): void {
    if ((event.target as HTMLInputElement).value === '') {
      this.eventDate = new Date()
    } else {
      this.eventDate = new Date((event.target as HTMLInputElement).value)
      this.eventDate.setHours(this.eventDate.getHours() - 1)
    }
    localStorage.setItem('eventDate', this.eventDate.toISOString())
  }
}

function calculateDateDiff(endDay: Date): TimeLeftConstruct {
  const dDay = endDay.valueOf()
  const miliSecInASecond = 1000
  const hoursInADay = 24
  const minutesInAnHour = 60
  const secondsInAMinute = 60
  const timeDiff = dDay - Date.now()

  const daysToDday = Math.floor(
    timeDiff / (miliSecInASecond * minutesInAnHour * secondsInAMinute * hoursInADay),
  )

  const hoursToDday = Math.floor(
    (timeDiff / (miliSecInASecond * minutesInAnHour * secondsInAMinute)) % hoursInADay,
  )

  const minutesToDday = Math.floor(
    (timeDiff / (miliSecInASecond * minutesInAnHour)) % secondsInAMinute,
  )

  const secondsToDday = Math.floor(timeDiff / miliSecInASecond) % secondsInAMinute

  return { secondsToDday, minutesToDday, hoursToDday, daysToDday }
}
