<template>
  <div class="comment-coontainer">
    <!-- 评论框 -->
    <el-card style="'margin-bottom': '20px'">
      <template #header><h4>评论</h4></template>
      <el-form :model="commentParams" :rules="rules" class="form">
        <el-row type="flex" justify="flex-start" :gutter="30" class="info">
          <el-col :span="8">
            <el-form-item prop="nickName">
              <el-input
                v-model="commentParams.nickName"
                placeholder="昵称"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="email">
              <el-input
                v-model="commentParams.email"
                placeholder="邮箱"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="comment-input">
            <el-form-item prop="content">
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 10 }"
                placeholder="评论..."
                v-model="commentParams.content"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <!-- <el-col :span="4"> -->
          <el-button type="primary" size="mini" @submit="addComment()"
            >评论</el-button
          >
          <!-- </el-col> -->
        </el-row>
      </el-form>
    </el-card>

    <el-card>

    </el-card>
  </div>
</template>

<script>
import { reactive, watch, toRefs } from "vue";
import { queryComments, addComment } from "../../api/comment";
import { handleComents } from "../../utils/common";

export default {
  name: "Comment",
  props: {
    aid: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const state = reactive({
      comments: [],
      params: {
        ref: "",
      },
      commentList: [],
      aid: 0,
      commentParams: {
        email: "",
        nickName: "",
        content: "",
      },
      directory: [],
    });

    const getComment = () => {
      queryComments(state.params).then((resp) => {
        if (resp.code === 0) {
          state.comments = resp.content;
          context.emit("getCommentSize", state.comments.length);
        }
      });
    };

    watch(
      () => props.aid,
      (newVal) => {
        state.params.ref = newVal;
        state.aid = newVal;
        getComment();
      }
    );

    watch(
      () => state.comments,
      (newVal) => {
        console.log(newVal);
        const data = handleComents(newVal);
        console.log(data);
        state.commentList = data;
      }
    );

    return { ...toRefs(state), getComment };
  },
  data() {
    return {
      rules: {
        nickName: [
          { required: true, message: "请输入昵称", trigger: "submit" },
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "submit" }],
        content: [{ required: true, message: "请输入评论", trigger: "submit" }],
      },
    };
  },
  methods: {
    addComment(parentId) {
      this.commentParams.ref = this.aid;
      if (parentId) {
        this.commentParams.parentId = parentId;
      }
      addComment(this.commentParams).then((res) => {
        if (res.code === 0) {
          this.getComment();
        } else {
          this.message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.comment-coontainer {
  .form {
    border: 1px #ddd dashed;
    padding: 0 15px 10px 15px;
    border-radius: 4px;

    .info {
      height: 45px;
      border-bottom: 1px #ddd dashed;
      margin-bottom: 10px;
    }

    .comment-input {
      width: 90%;
    }
  }
}
</style>