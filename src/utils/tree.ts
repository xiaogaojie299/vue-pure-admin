/**
 * @description 提取菜单树中的每一项uniqueId
 * @param tree 树
 * @returns 每一项uniqueId组成的数组
 */
export const extractPathList = (tree: any[]): any => {
  if (!Array.isArray(tree)) {
    console.warn("tree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  const expandedPaths: Array<number | string> = [];
  for (const node of tree) {
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      extractPathList(node.children);
    }
    expandedPaths.push(node.uniqueId);
  }
  return expandedPaths;
};

/**
 * @description 如果父级下children的length为1，删除children并自动组建唯一uniqueId
 * @param tree 树
 * @param pathList 每一项的id组成的数组
 * @returns 组件唯一uniqueId后的树
 */
export const deleteChildren = (tree: any[], pathList = []): any => {
  if (!Array.isArray(tree)) {
    console.warn("menuTree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  for (const [key, node] of tree.entries()) {
    if (node.children && node.children.length === 1) delete node.children;
    node.id = key;
    node.parentId = pathList.length ? pathList[pathList.length - 1] : null;
    node.pathList = [...pathList, node.id];
    node.uniqueId =
      node.pathList.length > 1 ? node.pathList.join("-") : node.pathList[0];
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      deleteChildren(node.children, node.pathList);
    }
  }
  return tree;
};

/**
 * @description 创建层级关系
 * @param tree 树
 * @param pathList 每一项的id组成的数组
 * @returns 创建层级关系后的树
 */
export const buildHierarchyTree = (tree: any[], pathList = []): any => {
  if (!Array.isArray(tree)) {
    console.warn("tree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  for (const [key, node] of tree.entries()) {
    node.id = key;
    node.parentId = pathList.length ? pathList[pathList.length - 1] : null;
    node.pathList = [...pathList, node.id];
    const hasChildren = node.children && node.children.length > 0;
    if (hasChildren) {
      buildHierarchyTree(node.children, node.pathList);
    }
  }
  return tree;
};

/**
 * @description 广度优先遍历，根据唯一uniqueId找当前节点信息
 * @param tree 树
 * @param uniqueId 唯一uniqueId
 * @returns 当前节点信息
 */
export const getNodeByUniqueId = (
  tree: any[],
  uniqueId: number | string
): any => {
  if (!Array.isArray(tree)) {
    console.warn("menuTree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  const item = tree.find(node => node.uniqueId === uniqueId);
  if (item) return item;
  const childrenList = tree
    .filter(node => node.children)
    .map(i => i.children)
    .flat(1) as unknown;
  return getNodeByUniqueId(childrenList as any[], uniqueId);
};

/**
 * @description 向当前唯一uniqueId节点中追加字段
 * @param tree 树
 * @param uniqueId 唯一uniqueId
 * @param fields 需要追加的字段
 * @returns 追加字段后的树
 */
export const appendFieldByUniqueId = (
  tree: any[],
  uniqueId: number | string,
  fields: object
): any => {
  if (!Array.isArray(tree)) {
    console.warn("menuTree must be an array");
    return [];
  }
  if (!tree || tree.length === 0) return [];
  for (const node of tree) {
    const hasChildren = node.children && node.children.length > 0;
    if (
      node.uniqueId === uniqueId &&
      Object.prototype.toString.call(fields) === "[object Object]"
    )
      Object.assign(node, fields);
    if (hasChildren) {
      appendFieldByUniqueId(node.children, uniqueId, fields);
    }
  }
  return tree;
};

/**
 * @description 构造树型结构数据，并添加 level 字段表示层级
 * @param data 数据源
 * @param id id字段 默认 'id'
 * @param parentId 父节点字段 默认 'parentId'
 * @param children 子节点字段 默认 'children'
 * @param level 初始层级，默认从1开始
 * @returns 构造完成的树结构，每个节点包含 level 字段
 */
export const handleTree = (
  data: any[],
  id?: string,
  parentId?: string,
  children?: string,
  level: number = 1
): any => {
  if (!Array.isArray(data)) {
    console.warn("data must be an array");
    return [];
  }

  const config = {
    id: id || "id",
    parentId: parentId || "parentId",
    childrenList: children || "children"
  };

  const childrenMap: Record<string, any[]> = {};
  const nodeMap: Record<string, any> = {};
  const tree: any[] = [];

  // 初始化映射表并设置 level=1 的根节点
  for (const d of data) {
    const nodeId = d[config.id];
    const parentKey = d[config.parentId];

    if (!childrenMap[parentKey]) {
      childrenMap[parentKey] = [];
    }
    childrenMap[parentKey].push(d);

    nodeMap[nodeId] = d;

    // 给当前节点赋初始 level
    d[config.childrenList] = d[config.childrenList] || [];
    d.level = level;
  }

  // 找出所有根节点（没有父节点的节点）
  for (const d of data) {
    const parentKey = d[config.parentId];
    if (!nodeMap[parentKey]) {
      tree.push(d);
    }
  }

  // 递归给所有子节点添加 level 属性
  function setLevel(node: any, currentLevel: number) {
    node.level = currentLevel;
    if (childrenMap[node[config.id]]) {
      childrenMap[node[config.id]].forEach(child => setLevel(child, currentLevel + 1));
    }
  }

  // 为整棵树设置层级
  for (const root of tree) {
    setLevel(root, level);
  }

  // 将子节点挂载到对应父节点上
  for (const d of data) {
    const parentId = d[config.parentId];
    if (parentId && nodeMap[parentId]) {
      if (!nodeMap[parentId][config.childrenList]) {
        nodeMap[parentId][config.childrenList] = [];
      }
      nodeMap[parentId][config.childrenList].push(d);
    }
  }

  return tree;
};
