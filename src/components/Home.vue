<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/water.png" />
        <span>BearBlog 后台系统</span>
      </div>
      <div>
        <el-avatar :src="userInfo.avatar"></el-avatar>
        用户名：{{ userInfo.username }} 角色：{{ userInfo.roleList }}
      </div>
      <el-button
        type="primary"
        plain
        @click="logout"
        round
        v-text="'退出 ' + userInfo.username"
      >
      </el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
          :unique-opened="true"
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.menusName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="active('/' + subitem.path)"
            >
              <!-- 二级菜单 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.menusName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style lang="less" scoped>
.el-menu span {
  margin-left: 5px;
}
.el-header {
  background: #545c64;
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  border-bottom: 1px solid wheat;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  img {
    width: 50px;
    height: 50px;
  }
}
.el-aside {
  background-color: #545c64;
  .el-menu {
    border: 0;
  }
  .toggle-button {
    background: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
}
.el-main {
  background: #eeeeee;
}
.home-container {
  height: 100%;
}
.toggle-button {
  background-color: #909399;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}
.el-avatar {
  margin-right: 10px;
}
</style>
<script>
// import Stomp from 'stompjs'
export default {
  name: 'messageNotice',
  data () {
    return {
      menulist: [],
      userInfo: {},
      client: null,
      iconsObj: {
        // 101: 'el-icon-s-data',
        // 102: 'el-icon-s-custom',
        // 103: 'el-icon-s-order',
        // 104: 'el-icon-s-promotion'
        // 105: 'el-icon-menu',
        // 106: 'el-icon-s-comment',
        // 107: 'el-icon-s-tools'
      },
      // 激活地址
      activePath: ''
    }
  },
  methods: {
    // webSocket连接成功后回调函数
    // onConnected (frame) {
    //   // 绑定交换机exchange_pushmsg是交换机的名字rk_pushmsg是绑定的路由key
    //   var exchange = '/exchange/message_exchange/message_send'
    //   // 创建随机队列用上面的路由key绑定交换机,放入收到消息后的回调函数和失败的回调函数
    //   this.client.subscribe(exchange, this.responseCallback, this.onFailed)
    // },
    // onFailed (frame) {
    //   console.log('Failed: ' + frame)
    // },
    // responseCallback (frame) {
    //   this.$notify({
    //     title: '通知',
    //     message: frame.body,
    //     duration: 0
    //   })
    // },
    // connect () {
    //   // 这里填你rabbitMQ的连接ip地址直接替换localhost:15674就好其它的不用改
    //   this.client = Stomp.client('ws://47.103.201.192:15674/ws')
    //   // 填写你rabbitMQ登录的用户名和密码
    //   var headers = {
    //     login: 'guest',
    //     passcode: 'guest',
    //     // 虚拟主机，默认“/”
    //     host: '/'
    //   }
    //   // 创建连接,放入连接成功和失败回调函数
    //   this.client.connect(headers, this.onConnected, this.onFailed)
    // },
    async logout () {
      const { data: res } = await this.$http.post('/logout')
      if (res.code !== 200) {
        this.$message.error(res.msg)
      }
      this.lastLogin(this.userInfo.userId)
      this.$message.success('登出成功')
      window.localStorage.clear()
      this.$router.push('/login')
    },
    async lastLogin (id) {
      const { data: res } = await this.$http.put('/commonAdmin/lastLogin/' + id)
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
    },
    // 请求菜单列表
    async getMenuList () {
      const { data: result } = await this.$http.get('/commonAdmin/findAllMenus')
      if (result.code !== 200) return this.$message.error('获取菜单列表失败')
      this.menulist = result.data
    },
    // 保存激活状态
    active (active) {
      // window.sessionStorage.setItem('active', active)
      window.localStorage.setItem('active', JSON.stringify(active))
      this.activePath = active
    },
    async getUserInfo () {
      const token = JSON.parse(window.localStorage.getItem('token'))
      const { data: res } = await this.$http.get(
        '/commonAdmin/userInfo/' + token
      )
      if (res.code !== 200) {
        this.$message.error('获取用户失败，请尝试重新登录')
      }
      this.userInfo = res.data
    }
  },
  created () {
    this.getMenuList()
    this.getUserInfo()
    // this.connect()
    this.activePath = JSON.parse(window.localStorage.getItem('active'))
  }
}
</script>
