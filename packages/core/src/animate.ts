import { interpolate, interpolateTransformCss } from 'd3-interpolate'
import { Task, type TaskOptions } from './task'
import { Timer } from './timer'
import { isArray, isDom, isNil, isObject, isString, TRANSFORM_FIELDS } from './utils'

export type AnimaterTarget = Element | Record<string, unknown>
export type AnimaterTargets = string | string [] | Element | Element[] | Record<string, unknown>
export type AnimaterOptions = TaskOptions

export class Animater {
  targets: Array<Element | Record<string, unknown>> = []
  timer: Timer = new Timer()

  constructor(targets: AnimaterTargets, attrs: Record<string, unknown>, options: AnimaterOptions) {
    if (isArray(targets)) {
      targets.forEach((target) => {
        if (isString(target)) {
          (this.targets as Element[]).push(document.querySelector(target) as Element)
        }
        else {
          this.targets = targets as Element[]
        }
      })
    }
    else if (isDom(targets)) {
      this.targets = [targets as Element]
    }
    else if (isObject(targets)) {
      this.targets = [targets as Record<string, unknown>]
    }
    else {
      this.targets = [document.querySelector(targets as string) as Element]
    }
    this.targets = this.targets.filter(Boolean)
    this.targets.forEach(target => this.timer.addTask(new AnimaterTask(this.timer, target, attrs, options)))
  }
}

export class AnimaterTask extends Task {
  from: Record<string, unknown> | null = null
  to: Record<string, unknown> | null = null

  constructor(timer: Timer, target: AnimaterTarget, attrs: Record<string, unknown>, options: AnimaterOptions) {
    super((task) => {
      this.initStates(target, attrs)

      const { startTime, pauseTime, duration } = task
      const { now } = timer
      let progress = 0
      if (now >= startTime) {
        progress = Math.min((now - startTime - pauseTime) / duration, 1)
      }
      this.setAttrs(target, progress)
    }, options)
  }

  initStates(target: AnimaterTarget, attrs: Record<string, unknown>) {
    if (this.from && this.to)
      return

    if (!isDom(target)) {
      this.from = structuredClone(target as Record<string, unknown>)
      this.to = structuredClone(attrs)

      return
    }

    this.from = Object.keys(attrs).reduce<Record<string, unknown>>((obj, key) => {
      const type = this.getAttrType(target, key)

      if (type === 'ATTRIBUTE') {
        obj[key] = target.getAttribute(key)
      }

      if (type === 'STYLE') {
        // @ts-expect-error target.style index
        obj[key] = target.style[key] || getComputedStyle(target)[key]
      }

      if (type === 'TRANSFORM' && !obj.transform) {
        obj.transform = target.style.transform || getComputedStyle(target).transform

        if (obj.transform === 'none') {
          obj.transform = ''
        }
      }

      return obj
    }, {})

    this.to = Object.entries(attrs).reduce<Record<string, unknown>>((obj, [key, value]) => {
      const type = this.getAttrType(target, key)
      if (type === 'TRANSFORM') {
        let transform = (obj.transform as string) || target.style.transform || getComputedStyle(target).transform

        if (transform.includes(key)) {
          transform = transform.replace(new RegExp(`${key}\(\S+\)(?=\s)`), `${key}(${value})`)
        }
        else if (transform === 'none') {
          transform = `${key}(${value})`
        }
        else {
          transform = `${transform.trim()} ` + `${key}(${value})`
        }
        obj.transform = transform
      }
      else {
        obj[key] = value
      }

      return obj
    }, {})
  }

  getAttrType(target: unknown, key: string) {
    if (!isDom(target)) {
      return 'OBJECT_KEY'
    }

    if (TRANSFORM_FIELDS.includes(key))
      return 'TRANSFORM'

    // @ts-expect-error target.style index
    if (!isNil(target.style[key]))
      return 'STYLE'

    return 'ATTRIBUTE'
  }

  setAttr(target: AnimaterTarget, key: string, progress: number) {
    if (!isDom(target)) {
      // @ts-expect-error interpolate params
      (target as Record<string, unknown>)[key] = interpolate(this.from![key], this.to![key])(progress)
      return
    }

    const attrType = this.getAttrType(target, key)
    if (key === 'transform' || attrType === 'TRANSFORM') {
      target.style.transform = interpolateTransformCss(this.from!.transform as string, this.to!.transform as string)(progress)
      return
    }
    if (attrType === 'STYLE') {
      // @ts-expect-error target.style index
      target.style[key] = interpolate(this.from![key], this.to![key])(progress)
      return
    }

    // @ts-expect-error target.style index
    target.setAttribute(key, interpolate(this.from![key], this.to![key])(progress))
  }

  setAttrs(target: AnimaterTarget, progress: number) {
    Object.keys(this.to!).forEach((key) => {
      this.setAttr(target, key, progress)
    })
  }
}
