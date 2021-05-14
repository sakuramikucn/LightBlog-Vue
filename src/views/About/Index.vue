<template>
  <div class="about-container">
    <el-row type="flex" justify="center">
      <el-col :md="16" class="main">
        <el-divider content-position="center">博客信息</el-divider>
        <div class="blog-info">
          <pre>本博客是基于SSM框架和Vue开发实现，实现了博客的基本功能。</pre>
          <b style="display: block; margin: 10px 0; font-size: 12px">技术栈</b>
          <ul style="margin-left: 10px; font-size: 12px; color: #888">
            <li>SSM：后端基本架构。基于JavaConfig方式搭建，内嵌Tomcat容器</li>
            <li>Redis：作为缓存使用。</li>
            <li>Vue：前端基本框架，使用3.0版本。使用了ElementUI组件库</li>
            <li>Shiro：权限控制。搭配JWT实现登录验证</li>
            <li>Docker：运行环境</li>
          </ul>
        </div>
        <el-divider content-position="center">个人信息</el-divider>
        <div class="me-info">
          <ul style="margin-left: 10px; font-size: 12px; color: #888">
            <li>博主：一个普通大学生</li>
            <li>专业：物联网工程</li>
            <li>技能：Java开发方向。Vue、SpringBoot、SSM、Redis。只会一点点</li>
            <li>
              联系方式：
              <el-link
                href="https://github.com/sakuramikucn"
                type="info"
                :underline="false"
                target="blank"
                style="margin-right: 5px"
                ><i class="iconfont icon-github"></i
              ></el-link>
              <el-link
                href="mailto:1519381662@qq.com"
                :underline="false"
                target="blank"
              >
                <i class="iconfont icon-email"></i>
              </el-link>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {},
};
</script>

<style lang="scss" scoped>
.about-container {
  min-height: 85vh;
  background: var(--color-bg);

  .main {
    margin: 20px 0;
    padding: 0 15px;
    min-height: 100px;
    background: #fff;
    border-radius: 5px;

    .blog-info,.me-info li {
      margin: 8px 0;
    }

    .blog-info li {
      margin: 8px 0;
    }

  }
}
</style>