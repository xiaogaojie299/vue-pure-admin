// 虽然字段很少 但是抽离出来 后续有扩展字段需求就很方便了

interface FormItemProps {
  /** 角色名称 */
  name: string;
}
interface FormProps {
  formInline: FormItemProps;
  isWatch: Boolean;
}

export type { FormItemProps, FormProps };
