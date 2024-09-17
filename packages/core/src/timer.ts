import type { Task } from './task'
import { getNow } from './utils'
import { FRAME_GAP } from './utils/constants'

export class Timer {
  now = getNow()
  tasks: Task[]
  status: 'idle' | 'paused' | 'pending' = 'idle'

  constructor(tasks?: Task[]) {
    this.tasks = tasks ?? []
    this.play()
  }

  updateNow() {
    this.now = getNow()
    this.flush()
  }

  addTask(task: Task) {
    this.tasks.push(task)
    this.play()
  }

  removeTask(task: Task) {
    task.cancel()
    const index = this.tasks.findIndex(item => item.id === task.id)
    this.tasks.splice(index, 1)
  }

  flush() {
    if (this.status === 'pending' || this.status === 'paused') {
      return
    }

    this.status = 'pending'
    this.updateNow()
    const expiredTasks = []

    for (const task of this.tasks) {
      if (task.status === 'finished') {
        expiredTasks.push(task)
        continue
      }

      if (task.status !== 'paused') {
        task.play()
      }

      if (task.startTime > this.now) {
        continue
      }

      const entTime = (task.loop || task.status === 'paused') ? Infinity : task.startTime + task.duration + FRAME_GAP

      if (entTime < this.now) {
        expiredTasks.push(task)
        continue
      }
    }
    this.status = 'idle'

    expiredTasks.forEach(task => this.removeTask(task))

    if (!this.tasks.length)
      return

    window.requestAnimationFrame(() => {
      this.flush()
    })
  }

  play() {
    this.status = 'idle'
    this.flush()
  }

  pause() {
    this.status = 'paused'
    this.tasks.forEach(task => task.pause())
  }

  cancel() {
    this.tasks.forEach((task) => {
      task.cancel()
    })
  }
}
