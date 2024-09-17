import type { Task } from './task'
import { FRAME_GAP } from './constants'
import { getNow } from './utils'

export class Timer {
  now = getNow()
  tasks: Task[]
  status: 'idle' | 'pending' = 'idle'

  constructor(tasks?: Task[]) {
    this.tasks = tasks ?? []
    this.tasks.forEach(task => task.play())
    this.flush()
  }

  updateNow() {
    this.now = getNow()
    this.flush()
  }

  addTask(task: Task) {
    this.tasks.push(task)
    task.play()
    this.flush()
  }

  removeTask(task: Task) {
    task.cancel()
    const index = this.tasks.findIndex(item => item.id === task.id)
    this.tasks.splice(index, 1)
  }

  flush() {
    if (this.status === 'pending') {
      return
    }

    this.status = 'pending'
    this.updateNow()
    const expiredTasks = []

    for (const task of this.tasks) {
      const entTime = (task.loop || task.status === 'paused') ? Infinity : task.startTime + task.duration + FRAME_GAP

      if (task.startTime > this.now) {
        continue
      }

      if (entTime < this.now || task.status === 'finished') {
        expiredTasks.push(task)
        continue
      }

      if (task.status !== 'paused') {
        task.play()
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

  cancel() {
    this.tasks.forEach((task) => {
      task.cancel()
    })
  }
}
