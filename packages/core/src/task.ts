import { getNow } from './utils'

export type TaskCallBack = (task: Task) => void

export interface TaskOptions {
  duration?: number
  delay?: number
  loop?: boolean
}

export type TaskStatus = 'idle' | 'delaying' | 'playing' | 'paused' | 'finished'

let id = 0

export class Task {
  readonly id: number

  readonly cb: TaskCallBack
  duration = 0
  delay = 0
  loop = false

  startTime = 0
  pauseTime = 0
  pauseStartTime = 0
  status: TaskStatus = 'idle'

  constructor(cb: TaskCallBack, options?: TaskOptions) {
    this.id = id++

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
      this.startTime = getNow() + this.delay
      this.pauseTime = 0
      this.pauseStartTime = 0

      this.status = 'delaying'
      if (this.startTime > getNow()) {
        return this
      }

      this.status = 'playing'
    }

    if (this.status === 'delaying') {
      if (this.startTime > getNow()) {
        return this
      }

      this.status = 'playing'
    }

    if (this.status === 'paused') {
      const now = getNow()
      this.pauseTime += now - this.pauseStartTime
      this.pauseStartTime = 0
      this.status = 'playing'

      this.run()

      return this
    }

    if (this.startTime <= getNow()) {
      this.run()
    }

    if (this.startTime + this.duration < getNow() && !this.loop) {
      this.status = 'finished'
      return this
    }

    return this
  }

  pause() {
    this.pauseStartTime = getNow()
    this.status = 'paused'
  }

  cancel() {
    this.status = 'finished'
  }

  run() {
    window.requestAnimationFrame(() => {
      this.cb(this)
    })
  }
}
