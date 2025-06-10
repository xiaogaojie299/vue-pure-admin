// src/utils/common.ts

/**
 * 根据 id 查找对应的字段值
 * @param array - 对象数组，每个对象必须包含 id 字段
 * @param id - 要查找的对象的 id
 * @param field - 要获取值的字段名（如 'age'）
 * @returns 对应字段的值，找不到则返回 null 或 undefined
 */
export function getFieldValueById<T extends { id: number }>(
  array: T[],
  id: number,
  field: keyof T
): any {
  const item = array.find(item => item.id === id);
  return item ? item[field] : null;
}