import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FRAME_GAP } from '../src/constants'
import { Task } from '../src/task'

let mock = vi.fn(() => console.warn('test timer'))

describe('test task', () => {
  beforeEach(() => {
    mock = vi.fn(() => console.warn('test timer'))
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('default options', () => {
    const task = new Task(mock)
    expect(task.duration).toBe(0)
    expect(task.delay).toBe(0)
    expect(task.loop).toBe(false)
  })

  it('custom options', () => {
    const task = new Task(mock, {
      duration: 1000,
      delay: 300,
      loop: true,
    })
    expect(task.duration).toBe(1000)
    expect(task.delay).toBe(300)
    expect(task.loop).toBe(true)
  })

  it('loop option', () => {
    const task = new Task(mock, {
      loop: true,
    })
    expect(task.loop).toBe(false)
  })

  it ('play', () => {
    const task = new Task(mock)
    task.play()
    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(1)
  })

  it ('duration', () => {
    const task = new Task(mock, {
      duration: 1000,
    })

    task.play()
    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(1)
    expect(task.status).toBe('playing')

    vi.advanceTimersByTime(1000)
    task.play()
    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(1)
    expect(task.status).toBe('finished')
  })

  it('duration & loop', () => {
    const task = new Task(mock, {
      duration: 1000,
      loop: true,
    })

    task.play()
    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(1)
    expect(task.status).toBe('playing')

    vi.advanceTimersByTime(1000)
    task.play()
    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(2)
    expect(task.status).toBe('playing')
  })

  it ('delay', () => {
    const task = new Task(mock, {
      delay: 1000,
    })

    task.play()
    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(0)
    expect(task.status).toBe('delaying')

    vi.advanceTimersByTime(1000)
    task.play()
    vi.advanceTimersByTime(FRAME_GAP)
    expect(mock).toBeCalledTimes(1)
    expect(task.status).toBe('finished')
  })
})
