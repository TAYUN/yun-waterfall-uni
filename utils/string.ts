function splitWord(string: string) {
  return string
    .split(/[^a-z0-9$]+/i)
    .map(item => item.split(/([A-Z][^A-Z]*)/))
    .flat()
    .filter(Boolean)
}

/**
 * 将字符串首字母转换为小写格式。
 */
export function lowerFirst(string: string) {
  return string.replace(/^[A-Z]/, m => m.toLowerCase())
}

/**
 * 将字符串首字母转换为大写格式。
 */
export function upperFirst(string: string) {
  return string.replace(/^[a-z]/, m => m.toUpperCase())
}

/**
 * 将字符串转换为 PascalCase 格式（大驼峰）。
 */
export function pascalCase(string: string) {
  return splitWord(string)
    .map(word => upperFirst(word.toLowerCase()))
    .join('')
}

/**
 * 生成唯一ID，用于设置元素的ID，以便获取
 */
export function uniqid(prefix = '__sar_'): string {
  return prefix + (~~(Math.random() * 10e8)).toString(36)
}

export type ClassProp =
  | string
  | number
  | null
  | undefined
  | Record<string, any>
  | ClassProp[]

/**
 * 把各种类型的参数拼接成字符串类名，以便解决小程序不支持 classObject 的问题
 */
export function classNames(...args: ClassProp[]) {
  let result = ''

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (!arg)
      continue

    if (typeof arg === 'string' || typeof arg === 'number') {
      result += `${arg} `
    }
    else if (Array.isArray(arg)) {
      if (arg.length) {
        const className = classNames(...arg)
        if (className) {
          result += `${className} `
        }
      }
    }
    else if (typeof arg === 'object') {
      for (const key in arg) {
        const value = arg[key]
        if (value) {
          result += `${key} `
        }
      }
    }
  }

  return result
}

export type StyleProp =
  | string
  | Record<any, any>
  | null
  | undefined
  | false
  | StyleProp[]

function toKebabCase(str: string) {
  return str
    .replace(/^[A-Z]/, m => m.toLowerCase())
    .replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
}

/**
 * 把样式对象拼接成字符串，解决小程序不支持 styleObject 的问题。
 */
export function stringifyStyle(...args: StyleProp[]): string {
  let result = ''

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (!arg)
      continue

    if (typeof arg === 'string') {
      result += `${arg};`
    }
    else if (Array.isArray(arg)) {
      if (arg.length) {
        const string = stringifyStyle(...arg)
        if (string) {
          result += `${string};`
        }
      }
    }
    else if (typeof arg === 'object') {
      for (const key in arg) {
        const value = arg[key]
        if (value || value === 0) {
          result += `${toKebabCase(key)}:${value};`
        }
      }
    }
  }

  return result
}
