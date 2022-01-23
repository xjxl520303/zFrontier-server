import { customAlphabet } from 'nanoid';

/**
 * 是否为对象
 * @param val 参数
 */
export const isObject = (val: any) => {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

/**
 * 是否为数字
 * @param val 参数
 */
export const isDigit = (val: any) => {
  return /^\d+$/.test(val);
}

/**
 * 将对象健值名称转换成首字母大写，适用腾讯云服务调用
 * @param val 要转换的对象
 */
export function toUpperCaseOfObjectKey<T>(val: Object): T {
  const result = {};
  if (isObject(val)) {
    Object.keys(val).forEach((key) => {
      const newKey = key.substring(0, 1).toUpperCase() + key.substring(1);
      result[newKey] = val[key];
      if (isObject(val[key])) {
        result[newKey] = toUpperCaseOfObjectKey(val[key]);
      } else if (Array.isArray(val[key])) {
        val[key].forEach((item: object, index: number) => {
          if (isObject(item)) {
            result[newKey][index] = toUpperCaseOfObjectKey(item);
          }
        });
      }
    })
  }
  return result as T;
}

/**
 * 将对象健值名称转换成首字母小写，适用腾讯云服务调用
 * @param val 要转换的对象
 */
export function toLowerCaseOfObjectKey<T>(val: object): T {
  const result = {};
  if (isObject(val)) {
    Object.keys(val).forEach((key) => {
      const newKey = key.substring(0, 1).toLowerCase() + key.substring(1);
      result[newKey] = val[key];
      if (isObject(val[key])) {
        result[newKey] = toLowerCaseOfObjectKey(val[key])
      } else if (Array.isArray(val[key])) {
        val[key].forEach((item: object, index: number) => {
          if (isObject(item)) {
            result[newKey][index] = toLowerCaseOfObjectKey(item);
          }
        });
      }
    })
  }
  return result as T;
}

/**
 * 生成短信6位验证码
 */
export const generateSmsShortId = () => {
  return customAlphabet('0123456789', 6)();
}
