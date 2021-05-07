<template>
  <div id="vditor"></div>
</template>

<script>
import Vditor from "vditor";
import "vditor/dist/index.css";

export default {
  name: "Editor",
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    content: {
      type: String,
      default: "loading...",
    },
  },
  data() {
    return {
      vditor: "",
    };
  },
  mounted() {
    const the = this;
    const defaultOpt = {
      height: 500,
      toolbar: [
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "|",
        "list",
        "ordered-list",
        "check",
        "outdent",
        "indent",
        "|",
        "quote",
        "line",
        "code",
        "inline-code",
        "insert-before",
        "insert-after",
        "|",
        "upload",
        "table",
        "|",
        "undo",
        "redo",
        "|",
        "fullscreen",
        "edit-mode",
        {
          name: "more",
          toolbar: [
            "both",
            "code-theme",
            "content-theme",
            "export",
            "outline",
            "preview",
            "devtools",
            "info",
            "help",
          ],
        },
      ],
      toolbarConfig: {
        pin: true,
      },
      cache: {
        enable: false,
      },
      outline: {
        enable: true,
        position: "right",
      },
      fullscreen: {
        index: 1000
      },
      after: function () {
        the.vditor.setValue(the.content);
      },
      input: function (md) {
        the.$emit("input", md);
      },
      upload: {
        fieldName: "file",
        //允许的图片后缀
        accept: "image/*,.wav,.jpg,.png,.gif,.jpeg,.svg",

        max: 10 * 1024 * 1024,

        headers: {
          Authorization: localStorage.getItem("token"),
        },

        // 上传图片要用的url
        url: process.env.VUE_APP_BASE_URL + "/upload",

        //上传成功时执行
        success(editor, msg) {
          let res = JSON.parse(msg);
          if (res.content) {
            const text = "![](" + res.content + ")";
            the.vditor.insertValue(text);
          } else {
            the.$message.error("上传失败");
          }
        },
        error() {
          the.$message.error("上传失败");
        },
      },
    };
    const opt = Object.assign(the.options, defaultOpt);
    this.vditor = new Vditor("vditor", opt);
  },
};
</script>

<style>
</style>