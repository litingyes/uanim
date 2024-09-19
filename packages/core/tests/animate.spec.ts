import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Animater } from '../src'
import { FRAME_GAP } from '../src/utils'

describe('test animate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('object', () => {
    const from = {
      number: 0,
      string: '0px',
      date: new Date('2014-01-01'),
      array: [0, 100],
      object: {
        a: 1,
        b: '1px',
      },
      color: 'rgb(255, 0, 0)',
      rotate: '90deg',
      scale: 2,
    }
    const to = {
      number: 100,
      string: '100px',
      date: new Date('2024-01-01'),
      array: [100, 0],
      object: {
        a: 10,
        b: '10px',
      },
      color: 'rgb(0, 0, 255)',
      rotate: '-90deg',
      scale: 1,
    }

    const animater = new Animater(from, to, {
      duration: 1000,
    })
    expect(animater).not.toBeNull()

    expect(from.number).toBe(0)
    expect(from.string).toBe('0px')
    expect(from.date.valueOf()).toBe(new Date('2014-01-01').valueOf())
    expect(from.array[0]).toBe(0)
    expect(from.array[1]).toBe(100)
    expect(from.object.a).toBe(1)
    expect(from.object.b).toBe('1px')
    expect(from.color).toBe('rgb(255, 0, 0)')
    expect(from.rotate).toBe('90deg')
    expect(from.scale).toBe(2)

    vi.advanceTimersByTime(200)
    expect(from.number).not.toBe(to.number)
    expect(from.string).not.toBe(to.string)
    expect(from.date.valueOf()).not.toBe(to.date.valueOf())
    expect(from.array[0]).not.toBe(to.array[0])
    expect(from.array[1]).not.toBe(to.array[0])
    expect(from.object.a).not.toBe(to.object.a)
    expect(from.object.b).not.toBe(to.object.b)
    expect(from.color).not.toBe(to.color)
    expect(from.rotate).not.toBe(to.rotate)
    expect(from.scale).not.toBe(to.scale)

    vi.advanceTimersByTime(200)
    expect(from.number).not.toBe(to.number)
    expect(from.string).not.toBe(to.string)
    expect(from.date.valueOf()).not.toBe(to.date.valueOf())
    expect(from.array[0]).not.toBe(to.array[0])
    expect(from.array[1]).not.toBe(to.array[0])
    expect(from.object.a).not.toBe(to.object.a)
    expect(from.object.b).not.toBe(to.object.b)
    expect(from.color).not.toBe(to.color)
    expect(from.rotate).not.toBe(to.rotate)
    expect(from.scale).not.toBe(to.scale)

    vi.advanceTimersByTime(200)
    expect(from.number).not.toBe(to.number)
    expect(from.string).not.toBe(to.string)
    expect(from.date.valueOf()).not.toBe(to.date.valueOf())
    expect(from.array[0]).not.toBe(to.array[0])
    expect(from.array[1]).not.toBe(to.array[0])
    expect(from.object.a).not.toBe(to.object.a)
    expect(from.object.b).not.toBe(to.object.b)
    expect(from.color).not.toBe(to.color)
    expect(from.rotate).not.toBe(to.rotate)
    expect(from.scale).not.toBe(to.scale)

    vi.advanceTimersByTime(200)
    expect(from.number).not.toBe(to.number)
    expect(from.string).not.toBe(to.string)
    expect(from.date.valueOf()).not.toBe(to.date.valueOf())
    expect(from.array[0]).not.toBe(to.array[0])
    expect(from.array[1]).not.toBe(to.array[0])
    expect(from.object.a).not.toBe(to.object.a)
    expect(from.object.b).not.toBe(to.object.b)
    expect(from.color).not.toBe(to.color)
    expect(from.rotate).not.toBe(to.rotate)
    expect(from.scale).not.toBe(to.scale)

    vi.advanceTimersByTime(200)
    expect(from.number).not.toBe(to.number)
    expect(from.string).not.toBe(to.string)
    expect(from.date.valueOf()).not.toBe(to.date.valueOf())
    expect(from.array[0]).not.toBe(to.array[0])
    expect(from.array[1]).not.toBe(to.array[0])
    expect(from.object.a).not.toBe(to.object.a)
    expect(from.object.b).not.toBe(to.object.b)
    expect(from.color).not.toBe(to.color)
    expect(from.rotate).not.toBe(to.rotate)
    expect(from.scale).not.toBe(to.scale)

    vi.advanceTimersByTime(FRAME_GAP * 2)
    expect(from.number).toBe(to.number)
    expect(from.string).toBe(to.string)
    expect(from.date.valueOf()).toBe(to.date.valueOf())
    expect(from.array[0]).toBe(to.array[0])
    expect(from.array[1]).toBe(to.array[1])
    expect(from.object.a).toBe(to.object.a)
    expect(from.object.b).toBe(to.object.b)
    expect(from.color).toBe(to.color)
    expect(from.rotate).toBe(to.rotate)
    expect(from.scale).toBe(to.scale)
  })

  it('dom', () => {
    const div = document.createElement('div')
    div.setAttribute('data-value', '0')
    div.style.color = 'rgb(255, 0, 0)'
    div.style.width = '10px'

    const to = {
      'data-value': '100',
      'color': 'rgb(0, 0, 255)',
      'width': '100px',
      // 'transform': 'scale(2)',
    }

    const animater = new Animater(div, to, {
      duration: 1000,
    })
    expect(animater).not.toBeNull()

    expect(div.getAttribute('data-value')).toBe('0')
    expect(div.style.color).toBe('rgb(255, 0, 0)')
    expect(div.style.width).toBe('10px')
    // expect(div.style.transform).toBe('')

    vi.advanceTimersByTime(500)
    expect(div.getAttribute('data-value')).not.toBe('0')
    expect(div.style.color).not.toBe('rgb(255, 0, 0)')
    expect(div.style.width).not.toBe('10px')
    // expect(div.style.transform).not.toBe('')
    expect(div.getAttribute('data-value')).not.toBe('100')
    expect(div.style.color).not.toBe('rgb(0, 0, 255)')
    expect(div.style.width).not.toBe('100px')
    // expect(div.style.transform).not.toBe('scale(2)')
  })
})
