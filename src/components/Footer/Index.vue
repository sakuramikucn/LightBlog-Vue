<template>
  <el-row type="flex" justify="center" class="footer">
    <!-- <el-col hidden-xs-only :sm="2" :md="4" /> -->
    <el-col :xs="24" :sm="20" :md="16" class="content">
      <!-- 版权信息 -->
      <div class="centent-left">
        <p>
          <span>Copyright © 2021 </span>
          <el-link :href="copyright.url" type="info" :underline="false" class="copyright">
            {{ copyright.name }}
          </el-link>
        </p>
        <p>
          <el-link :href="security.url" type="info" :underline="false">{{
            security.name
          }}</el-link>
          |
          <el-link :href="icp.url" type="info" :underline="false">{{
            icp.name
          }}</el-link>
        </p>
      </div>
      <!-- github -->
      <div class="content-right">
        <el-link
          href="https://github.com/sakuramikucn"
          icon="el-icon-link"
          type="info"
          :underline="false"
        ></el-link>
      </div>
    </el-col>
    <!-- <el-col hidden-xs-only :sm="2" :md="4" /> -->
  </el-row>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      copyright: {
        name: "Light Blog",
        url: "https://blog.sakuramiku.cn",
      },
      icp: {
        name: "桂ICP备20002795号-1",
        url: "https://beian.miit.gov.cn/",
      },
      security: {
        name: "桂公网安备 45031202000218号 ",
        url:
          "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=45031202000218",
      },
    };
  },
};
</script>

<style>
.footer {
  border-top-color: #dcdfe6;
  box-shadow: 1px -1px 2px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 8px;
  text-align: center;
  vertical-align: center;
}
.footer .content {
  display: flex;
  justify-content: center;
}
.content-left {
  width: 500px;
  margin: 0 auto;
}
.content-left p{
  vertical-align: top;
}
.content-left p span {
  color: #466;
}
.copyright {
  margin: 0 0 4px 0;
}
.content-right {
  width: 150px;
}
</style>