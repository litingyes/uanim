export const isString = (val: unknown) => typeof val === 'string'

export const isArray = (val: unknown) => Array.isArray(val)

export const isObject = (val: unknown) => typeof val === 'object' && !isArray(val)

export const isNil = (val: unknown) => val == null

export const isDom = (val: unknown) => val instanceof HTMLElement
