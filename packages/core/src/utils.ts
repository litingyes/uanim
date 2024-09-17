export const isString = (val: unknown) => typeof val === 'string'

export const isArray = (val: unknown) => Array.isArray(val)

export const isObject = (val: unknown) => typeof val === 'object'

export const getNow = () => Date.now()
