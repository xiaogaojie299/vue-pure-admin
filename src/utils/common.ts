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
export function convertArrayToString(
  arr: (number | undefined)[][],
  key = "&"
): string {
  return arr
    .map(
      subArr =>
        subArr
          .filter(item => item !== undefined && item !== null) // 过滤掉 undefined 和 null
          .join(key) // 子数组用 & 拼接
    )
    .join(","); // 用 , 拼接每个子数组的结果
}

// "1&2&3,4&5&6" 转换为 [ [1, ,2, 3], [4, 5, 6] ]
export function convertStringToArray(str: string, key = "&"): number[][] {
  return str.split(",").map(group => {
    return group.split(key).map(Number);
  });
}

// "1&2&3,4&5&6" 转换为 [ ['1', '2', '3'], ['4', '5', '6'] ]
export function convertStringToArrayOrItemStr(
  str: string,
  key = "&"
): string[][] {
  return str?.split(",")?.map(group => {
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

interface TreeNode {
  id: number;
  title: string;
  [key: string]: any; // 支持其他字段
}

/**
 * 将树形结构中的每个节点的 children 字段与其他字段分离
 * @param tree 树形结构数组
 * @returns 包含两个部分：
 */
export function splitTreeChildren(tree: TreeNode[]) {
  const nodes: Omit<TreeNode, "children">[] = [];
  const childrenMap: Record<number, TreeNode[]> = {};

  function traverse(data: TreeNode[], parentId: number | null = null) {
    return data.map(node => {
      const { children, ...rest } = node;

      // 添加到主节点列表（不含 children）
      nodes.push(rest);

      // 如果有 children，保存映射关系
      if (children && children.length > 0) {
        childrenMap[rest.id] = children;
        traverse(children, rest.id);
      }

      return rest;
    });
  }

  traverse(tree);

  return {
    nodes,
    childrenMap
  };
}


interface ModuleItem {
  id: number;
  orgId: number;
  moduleType: number;
  name: string;
  tips: string | null;
  fieldType: number;
  configKey: number;
  submitValue: any;
  createTime: string;
  remark: string | null;
}

type GroupedModules = Record<number, ModuleItem[]>;

/**
 * 根据 moduleType 归类数据
 * @param data 原始数据数组
 * @returns 按 moduleType 分组的对象
 */
export function groupByModuleType(data: ModuleItem[]): GroupedModules {
  return data.reduce((acc, item) => {
    const key = item.moduleType;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as GroupedModules);
}

/**
 * 将二维数组降维成一维数组，并过滤空值（如 undefined、null）
 * @param array 二维数组
 * @returns 一维数组
 */
export function flatten2DArray<T>(array: (T | T[])[]): T[] {
  return array
    .flat()
    .filter((item): item is T => item !== undefined && item !== null);
}

export function toQueryString(data: Record<string, any>): string {
  return Object.entries(data)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
}

/**
 * 判断一个对象是否为空
 * @param obj - 需要检查的对象
 * @returns 如果对象为空，返回 true；否则返回 false
 */
export function isEmptyObject(obj: any): boolean {
  // 检查传入的参数是否为对象类型
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  // 使用 Object.keys 获取对象的所有可枚举属性的数组，并检查其长度
  return Object.keys(obj).length === 0;
}