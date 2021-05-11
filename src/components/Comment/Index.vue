<template>
  <div class="comment-coontainer">
    <!-- 评论框 -->
    <el-card>
      <template #header><h4>评论</h4></template>
      <el-form :model="commentParams" :rules="rules" class="form">
        <el-row type="flex" justify="flex-start" class="info" :gutter="30">
          <el-col :span="8">
            <el-form-item prop="nickName">
              <el-input
                v-model="commentParams.nickName"
                placeholder="昵称"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="email">
              <el-input
                v-model="commentParams.email"
                placeholder="邮箱"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="18" class="comment-input">
            <el-form-item prop="content">
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 10 }"
                placeholder="评论..."
                v-model="commentParams.content"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              size="mini"
              @click="addComment()"
              :loading="loading"
              >评论</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="comment-card">
      <template #header>
        <h4>{{ total }}条评论</h4>
      </template>
      <ul v-if="comments && comments.length > 0" class="commentList">
        <li v-for="(item, idx) in comments" :key="idx">
          <!-- 主评论 -->
          <div class="comment-item">
            <el-row type="flex" justify="space-between">
              <el-col class="flex jfs" :span="20">
                <h4>
                  <i class="el-icon-user"></i>{{ getNickName(item.comment) }}
                </h4>
                <span style="margin-left: 20px; color: #888; font-size: 12px">{{
                  format(item.comment.createTime)
                }}</span>
              </el-col>
              <el-col :span="4" style="padding: auto 10px">
                <el-col>
                  <el-link
                    href="javascript: void(0)"
                    type="primary"
                    icon="el-icon-chat-line-square"
                    :underline="false"
                    @click="openReply(item)"
                  >
                    <span>回复</span>
                  </el-link>
                </el-col>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center">
              <el-col :span="23">
                <span v-if="item.comment.state === 1"
                  ><del>内容已屏蔽</del></span
                >
                <span v-else>{{ item.comment.content }}</span>
              </el-col>
            </el-row>
          </div>

          <!-- 子评论 -->
          <ul v-if="item.childList" class="subComment">
            <li
              v-for="sub in item.childList"
              :key="sub.id"
              class="comment-item"
            >
              <el-row type="flex" justify="space-between">
                <el-col class="flex jfs" :span="20">
                  <h4>
                    <i class="el-icon-user"></i>{{ getNickName(sub.comment) }}
                  </h4>
                  <span
                    style="margin-left: 20px; color: #888; font-size: 12px"
                    >{{ format(sub.comment.createTime) }}</span
                  >
                </el-col>
                <el-col :span="4" style="padding: auto 10px">
                  <el-col>
                    <el-link
                      href="javascript: void(0)"
                      type="primary"
                      icon="el-icon-chat-line-square"
                      :underline="false"
                      @click="openReply(sub)"
                    >
                      <span>回复</span>
                    </el-link>
                  </el-col>
                </el-col>
              </el-row>
              <el-row type="flex" justify="center">
                <el-col :span="23">
                  <span v-if="sub.comment.state === 1"
                    ><del>内容已屏蔽</del></span
                  >
                  <span v-else
                    ><span style="color: blue"
                      >@{{ getNickName(sub.parent) }}：</span
                    >{{ sub.comment.content }}</span
                  >
                </el-col>
              </el-row>
            </li>
          </ul>
        </li>
      </ul>
      <el-alert v-else :closable="false" type="info" 
        >还没有评论，赶紧评论吧！</el-alert
      >
    </el-card>

    <el-dialog v-model="show" width="40%" title="回复">
      <!-- 评论框 -->
      <el-card shadow="never">
        <!-- <template #header><h4>评论</h4></template> -->
        <el-form :model="commentParams" :rules="rules" class="form">
          <el-row type="flex" justify="flex-start" class="info" :gutter="30">
            <el-col :span="8">
              <el-form-item prop="nickName">
                <el-input
                  v-model="commentParams.nickName"
                  placeholder="昵称"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="email">
                <el-input
                  v-model="commentParams.email"
                  placeholder="邮箱"
                  size="mini"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="18" class="comment-input">
              <el-form-item prop="content">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 10 }"
                  placeholder="评论..."
                  v-model="commentParams.content"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button
                type="primary"
                size="mini"
                @click="addComment(selectedComment)"
                :loading="loading"
                >评论</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, watch, toRefs } from "vue";
import { Comment } from "api/main";
import { formatDateTime, setItem, getItem } from "utils/common";

export default {
  name: "Comment",
  props: {
    aid: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
  },
  setup(props, context) {
    const state = reactive({
      comments: [],
      params: {
        ref: "",
        type: 1,
      },
      aid: 0,
      commentParams: {
        email: "",
        nickName: "",
        content: "",
        reference: "",
        parentId: "",
        subReference: "",
        type: props.type,
        // username: this.comment.username
      },
      loading: false,
      show: false,
      selectedComment: {},
      total: 0,
    });

    // 获取缓存信息
    const info = getItem("addCommentInfo");
    if (info) {
      state.commentParams.nickName = info.nickName;
      state.commentParams.email = info.email;
    }

    const getComment = () => {
      Comment.query(state.params).then((resp) => {
        if (resp.code === 0) {
          state.comments = resp.content.list;
          state.total = resp.content.total;
          context.emit("getCommentSize", state.total);
        }
      });
    };

    const openReply = (item) => {
      state.selectedComment = item;
      state.show = true;
    };

    watch(
      () => props.aid,
      (newVal) => {
        state.params.ref = newVal;
        state.aid = newVal;
        getComment();
      }
    );

    return { ...toRefs(state), getComment, openReply };
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
    addComment(row) {
      this.loading = true;
      // 做个缓存
      const addCommentInfo = {
        nickName: this.commentParams.nickName,
        email: this.commentParams.email,
      };
      setItem("addCommentInfo", addCommentInfo);

      this.commentParams.reference = this.aid;
      // 回复评论
      if (row) {
        this.commentParams.parentId = row.comment.id;
        if (row.comment.subReference) {
          // 记一下子引用
          this.commentParams.subReference = row.comment.subReference
        }else if(row.comment.parentId){
          this.commentParams.subReference = row.comment.parentId
        }
      }
      Comment.add(this.commentParams)
        .then((res) => {
          this.loading = false;
          if (res.content) {
            this.$message.success("回复成功");
            this.selectedComment = {};
            this.commentParams.content = ''
            this.show = false;
            this.getComment();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => (this.loading = false));
    },
    format(d) {
      return formatDateTime(d);
    },
    getNickName(row) {
      let nickName = row.nickName;
      const type = row.roleType;
      if (type === 1) {
        nickName = nickName + "(管理员)";
      } else if (type === 2) {
        nickName = nickName + "(作者)";
      }
      return nickName;
    },
  },
};
</script>

<style lang="scss" scoped>
.comment-coontainer {
  .form {
    // padding: 0 15px 10px 15px;
    border-radius: 4px;

    .info {
      height: 45px;
      margin-bottom: 10px;
    }

    .comment-input {
      width: 90%;
    }
  }

  .comment-card {
    margin: 10px auto;
  }

  .commentList {
    color: #666;

    .comment-item {
      padding: 5px 0;
      margin-bottom: 5px;
      border-bottom: 1px solid #eee;

      .el-row {
        padding: 5px 5px;
      }
    }

    .subComment {
      border-left: 5px solid #ccc;
      padding: 2px 5px 2px 20px;
    }
  }
}
</style>