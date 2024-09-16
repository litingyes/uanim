import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Timer } from '../src'

let mock = vi.fn(() => console.warn('test timer'))

describe('options', () => {
  it('downgrade loop', () => {
    const timer = new Timer(mock, {
      loop: true,
    })
    expect(timer.loop).toBe(false)
  })
})

describe('functions', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mock = vi.fn(() => console.warn('test timer'))
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('default options', () => {
    const timer = new Timer(mock)
    expect(timer.status).toBe('idle')

    timer.play()

    vi.runAllTimers()
    expect(mock).toBeCalledTimes(1)
    expect(timer.status).toBe('finished')
  })

  it('delay', () => {
    const timer = new Timer(mock, {
      delay: 1000,
    })
    expect(timer.status).toBe('idle')

    timer.play()

    vi.advanceTimersByTime(100)
    expect(mock).not.toHaveBeenCalled()
    expect(timer.status).toBe('playing')

    vi.advanceTimersByTime(1000)
    expect(mock).toBeCalledTimes(1)
    expect(timer.status).toBe('finished')
  })

  it('duration & loop', () => {
    const timer = new Timer(mock, {
      duration: 1000,
      loop: true,
    })
    expect(timer.status).toBe('idle')

    timer.play()

    vi.advanceTimersByTime(100)
    expect(mock).not.toHaveBeenCalled()
    expect(timer.status).toBe('playing')

    vi.advanceTimersByTime(1000)
    expect(mock).toBeCalledTimes(1)
    expect(timer.status).toBe('playing')

    vi.advanceTimersByTime(1000)
    expect(mock).toBeCalledTimes(2)
    expect(timer.status).toBe('playing')

    timer.cancel()
    expect(timer.status).toBe('finished')
  })

  it ('play & pause', () => {
    const timer = new Timer(mock, {
      duration: 1000,
      loop: true,
    })
    expect(timer.status).toBe('idle')

    timer.play()

    vi.advanceTimersByTime(100)
    expect(mock).not.toHaveBeenCalled()
    expect(timer.status).toBe('playing')

    vi.advanceTimersByTime(1000)
    expect(mock).toBeCalledTimes(1)
    expect(timer.status).toBe('playing')

    timer.pause()

    vi.advanceTimersByTime(1000)
    expect(mock).toBeCalledTimes(1)
    expect(timer.status).toBe('paused')

    timer.play()

    vi.advanceTimersByTime(100)
    vi.advanceTimersByTime(1000)
    expect(mock).toBeCalledTimes(2)
    expect(timer.status).toBe('playing')
  })
})
