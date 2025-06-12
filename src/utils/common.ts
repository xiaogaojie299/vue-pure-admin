// src/utils/common.ts

import { object } from "vue-types";

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

// [ [1, ,2, 3], [4, 5, 6] ] 转换为 "1&2&3,4&5&6"
export function convertArrayToString(arr: (number | undefined)[][], key='&'): string {
  return arr
    .map(subArr => 
      subArr
        .filter(item => item !== undefined && item !== null) // 过滤掉 undefined 和 null
        .join(key) // 子数组用 & 拼接
    )
    .join(','); // 用 , 拼接每个子数组的结果
}


// "1&2&3,4&5&6" 转换为 [ [1, ,2, 3], [4, 5, 6] ]
export function convertStringToArray(str: string, key='&'): number[][] {
  return str.split(',').map((group) => {
    return group.split(key).map(Number);
  });
}


// "1&2&3,4&5&6" 转换为 [ ['1', '2', '3'], ['4', '5', '6'] ]
export function convertStringToArrayOrItemStr(str: string, key='&'): string[][] {
  return str?.split(',')?.map((group) => {
    return group?.split(key)?.map(String);
  });
}

export function formatRegionValues(value: any[]) {
  const formInline = {
    countryId: undefined,
    provinceId: undefined,
    marketId: undefined,
    areaId: undefined,
    streetId: undefined
  };

  let keys = Object.keys(formInline);

  value.forEach((item, index) => {
    if (index < keys.length) {
      const field = keys[index];
      formInline[field] = item;
    }
  });
  return formInline;
}

/**
 * 根据 key 对数组对象去重
 * @param array 要去重的数组
 * @param key 根据哪个字段去重，如 'id'
 */
export function uniqueByKey<T>(array: T[], key: keyof T): T[] {
  const seen = new Map();
  return array.filter(item => {
    const val = item[key];
    if (seen.has(val)) {
      return false;
    } else {
      seen.set(val, true);
      return true;
    }
  });
}

/**
     * 获取选中节点的 label 路径
     * @param data 树形数据源
     * @param selectedIds 选中的 id 列表
     * @returns string[]
     */
    export function getSelectedLabels(data, selectedIds) {
      const result = [];
      function findLabelById(data, id) {
        for (const node of data) {
          if (node.id === id) {
            return node.name;
          }
          if (node.children) {
            const found = findLabelById(node.children, id);
            if (found) return found;
          }
        }
        return null;
      }
  
      for (const id of selectedIds) {
        const label = findLabelById(data, id);
        if (label) result.push(label);
      }
  
      return result;
    }
  
/**
 * 深度拍平任意嵌套数组，并过滤空值
 * @param arr - 可能嵌套的数组
 * @returns 一维数组
 */
export function deepFlattenAndFilter<T>(arr: any[]): T[] {
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) {
      acc.push(...deepFlattenAndFilter(val));
    } else if (val !== undefined && val !== null) {
      acc.push(val);
    }
    return acc;
  }, [] as T[]);
}