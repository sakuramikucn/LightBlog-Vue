<template>
  <div class="link-container">
    <el-row type="flex" justify="center" >
      <el-col :md="16" class="main"> 
        <ul class="f-rowwrap">
          <li v-for="item in data" :key="item.id" class="item">
            <a :href="item.url" target="_blank" style="display: block;">
              <div  style="width: 100%;height: 100px">
                  <el-image v-if="item.coverUrl" :src="item.coverUrl" fit="cover"  style="width: 100%;height: 100px"></el-image>
              </div>
              <div class="desc">
                <span>{{item.desc}}</span>
              </div>
               <el-divider></el-divider>
              <div class="title">
                <h3>{{item.name}}</h3>
              </div>
            </a>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Link } from "api/main";

export default {
  name: "Link",
  data() {
    return {
      data: [],
      params: {},
      loading: false
    };
  },
  methods: {
    getData() {
      this.loading = true
      Link.search(this.params).then(res => {
        this.loading = false
        if (res.content){
          this.data = res.content.list
        }
      }).catch(() => this.loading = false)
    },
  },
  created() {
    this.getData()
  }
};
</script>

<style lang="scss" scope>
.link-container {
  min-height: 85vh;
  background: var(--color-bg);

  .main {
    // background-color: #fff;
    min-height: 200px;
    margin: 30px 0;
    padding: 0 20px;
    
    .item {
      width: 150px;
      // height: 200px;
      margin-right: 10px;
      margin-bottom: 20px;
      background: #fff;
      box-shadow: 0 0 6px 2px #ddd;
      border-radius: 3px;

      .el-divider--horizontal {
        margin: 5px 0;
      }

      .title {
        // border-top: 1px solid #ddd;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }

      .desc {
        padding: 10px;
        color: #bbb;
        font-size: 10px;
      }
    }

    .item:hover {
      transform: scale(1.01);
    }
  }


}
</style>