<template>
    <div>
      <div id="div1" class="toolbar">
      </div>
      <div id="div2"  class="text">
      </div>
    </div>
</template>

<script>
  import E from 'wangeditor'
  export default {
    name: 'editor',
    props: {
      value: {
        default: ''
      }
    },
    data () {
      return {
        editor: null,
        editorContent: this.value
      }
    },
    methods: {
      getTxt: function () {
        return this.editor.txt.text()
      }
    },
    beforeDestroy() {
      this.editor = null
    },
    mounted() {
      var editor = new E('#div1', '#div2')
      editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
//        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        'code',  // 插入代码
        'undo',  // 撤销
        'redo'  // 重复
      ]
      editor.customConfig.uploadImgShowBase64 = true
      editor.customConfig.onchange = (html) => {
        this.editorContent = html
        this.$emit('input', html)
      }
      editor.create()
      this.editor = editor
      editor.txt.html(this.value)
    },
    watch: {
      value(v) {
        if (v !== this.editorContent) {
          this.editor.txt.html(v)
        }
      }
    }
  }
</script>

<style scoped>
  .toolbar {
    border: 1px solid #ccc;
  }
  .text {
    border: 1px solid #ccc;
    border-top: 0;
    height: 400px;
  }
</style>
