export type TimerCallBack = (...args: any[]) => void

export interface TimerOptions {
  duration?: number
  delay?: number
  loop?: boolean
}

export type TimerStatus = 'idle' | 'playing' | 'paused' | 'finished'

export class Timer {
  timeoutId: NodeJS.Timeout | undefined = undefined
  intervalId: NodeJS.Timeout | undefined = undefined

  cb: TimerCallBack
  duration = 0
  delay = 0
  loop = false

  startTime = 0
  pauseTime = 0
  pauseStartTime = 0
  status: TimerStatus = 'idle'

  constructor(cb: TimerCallBack, options?: TimerOptions) {
    this.cb = cb

    Object.assign(this, options)
    if (!this.duration) {
      this.loop = false
    }
  }

  play() {
    if (this.status === 'finished') {
      return this
    }

    if (this.status === 'idle') {
      this.startTime = performance.now()
      this.pauseTime = 0
      this.pauseStartTime = 0
      this.status = 'playing'

      this.run(this.delay)
      return this
    }

    if (this.status === 'paused') {
      const now = performance.now()
      this.pauseTime += now - this.pauseStartTime
      this.pauseStartTime = 0
      this.status = 'playing'

      let consumeRemainingTime = 0
      if (this.duration) {
        consumeRemainingTime = (now - this.startTime - this.pauseTime) % this.duration
      }

      this.run(consumeRemainingTime)

      return this
    }

    return this
  }

  pause() {
    this.clear()
    this.pauseStartTime = performance.now()
    this.status = 'paused'
  }

  cancel() {
    this.clear()
    this.status = 'finished'
  }

  clear() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = undefined
    }

    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
  }

  run(delay = 0) {
    window.requestAnimationFrame(() => {
      this.timeoutId = setTimeout(() => {
        clearTimeout(this.timeoutId)

        if (this.loop) {
          this.intervalId = setInterval(() => {
            this.cb()
          }, this.duration)

          return
        }

        this.cb()
        this.clear()
        this.status = 'finished'
        this.clear()
      }, delay)
    })
  }
}
