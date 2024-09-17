import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Task, Timer } from '../src'
import { FRAME_GAP } from '../src/utils'

let mock = vi.fn(() => console.warn('test timer'))

describe('test timer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mock = vi.fn(() => console.warn('test timer'))
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('flush', () => {
    const task = new Task(mock)
    const timer = new Timer([task])
    expect(timer.tasks.length).toBe(1)

    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(1)

    timer.cancel()
    vi.advanceTimersByTime(FRAME_GAP)
    expect(timer.tasks.length).toBe(0)
    expect(mock).toBeCalledTimes(2)

    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(2)
  })

  it('duration', () => {
    const task = new Task(mock, {
      duration: 1000,
    })
    const timer = new Timer([task])
    expect(timer.tasks.length).toBe(1)

    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(1)

    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(2)
  })

  it('delay', () => {
    const task = new Task(mock, {
      delay: 1000,
    })
    const timer = new Timer([task])
    expect(timer.tasks.length).toBe(1)

    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(0)

    vi.advanceTimersByTime(1000 + FRAME_GAP)
    expect(mock).toBeCalledTimes(1)
  })

  it('addTask & removeTask', () => {
    const task = new Task(mock, {
      delay: 1000,
    })
    const timer = new Timer([task])
    expect(timer.tasks.length).toBe(1)

    timer.addTask(new Task(mock, {
      delay: 1000,
    }))
    vi.advanceTimersByTime(FRAME_GAP)
    expect(timer.tasks.length).toBe(2)

    vi.advanceTimersByTime(FRAME_GAP)
    timer.removeTask(task)
    expect(timer.tasks.length).toBe(1)
  })

  it('cancel', () => {
    const task = new Task(mock, {
      duration: 1000,
    })
    const timer = new Timer([task])
    expect(timer.tasks.length).toBe(1)

    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(1)

    timer.cancel()
    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(2)
    expect(timer.tasks.length).toBe(0)

    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(2)
  })
})
