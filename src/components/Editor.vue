<template>
  <div>
    <div class="border border-solid border-gray-200">
      <Toolbar
        :editor="editorRef"
        :defaultConfig="{
          excludeKeys: ['uploadVideo']
        }"
        mode="default"
        class="border-b border-solid border-gray-200"
      />
      <div :class="props.className || 'h-96'">
        <Editor
          v-model="keyword"
          :defaultConfig="editorConfig"
          mode="default"
          @onCreated="editorCreated"
          @onChange="onChange"
          v-bind="$attrs"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  shallowRef,
  ref,
  reactive,
  onMounted,
  nextTick,
  defineProps,
  computed
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { DomEditor } from "@wangeditor/editor";
import "@wangeditor/editor/dist/css/style.css"; //
// import { request, uploadToOSS } from "@/utils";

const emits = defineEmits(["update:value", "change"]);
const props = defineProps({
  value: String,
  className: String,
  placeholder: String
});
const keyword = computed({
  get() {
    return props.value;
  },
  set(n) {
    emits("update:value", n);
  }
});
const editorRef = shallowRef();
const editorCreated = editor => {
  editorRef.value = editor;
  // nextTick(() => {
  //   const toolbar = DomEditor.getToolbar(editor)
  //   console.log(DomEditor, editor, toolbar);
  //   const curToolbarConfig = toolbar.getConfig()
  //   console.log( curToolbarConfig.toolbarKeys )
  // })
};
const onChange = e => {
  emits("change", e);
};

const editorConfig = {
  placeholder: props.placeholder || "请输入内容....",
  MENU_CONF: {
    uploadImage: {
      // 自定义上传
      async customUpload(file, insertFn) {
        console.log(file);
        // file 即选中的文件
        // const url = await uploadToOSS(file, file.name);
        // // 最后插入图片
        // insertFn(url, "image");
      }
    }
  }
};
</script>
