import { Directive, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core'

@Directive({
  selector: '[fitText]',
})
export class FitTextDirective implements OnInit, OnDestroy {
  private element: HTMLElement
  private resizeObserver: ResizeObserver | undefined
  private changeObserver: MutationObserver | undefined

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    this.element = this.el.nativeElement
  }

  ngOnInit(): void {
    this.adjustFontSize()

    this.resizeObserver = new ResizeObserver(() => {
      this.adjustFontSize()
    })
    this.resizeObserver.observe(this.element)

    this.changeObserver = new MutationObserver(() => {
      this.adjustFontSize()
    })
    this.changeObserver.observe(this.el.nativeElement, {
      childList: true,
      subtree: true,
      characterData: true,
    })
  }

  ngOnDestroy(): void {
    this.resizeObserver?.unobserve(this.element)
    this.changeObserver?.disconnect()
  }

  private adjustFontSize(): void {
    if (this.element?.textContent !== null && this.element.parentElement) {
      let calculatedFontSize = this.calculateFontSize(
        this.element.textContent,
        this.element.parentElement,
      )
      this.renderer.setStyle(this.element, 'font-size', `${calculatedFontSize}px`)
      this.renderer.setStyle(this.element, 'white-space', 'nowrap')
    }
  }

  private calculateFontSize(text: string, parent: HTMLElement): number {
    const element = document.createElement('span')

    element.style.position = 'absolute'
    element.style.visibility = 'hidden'
    element.style.whiteSpace = 'nowrap'
    element.innerText = text

    document.body.appendChild(element)

    let low = 1
    let high = 1000
    let fontSize

    while (low <= high) {
      fontSize = Math.floor((low + high) / 2)
      element.style.fontSize = `${fontSize}px`
      if (element.offsetWidth <= parent.offsetWidth) {
        low = fontSize + 1
      } else {
        high = fontSize - 1
      }
    }

    document.body.removeChild(element)
    return high
  }
}
