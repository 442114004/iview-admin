<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <!-- <Badge :dot="!!messageUnreadCount">
      </Badge> -->
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="userinfo">
          个人中心<Badge style="margin-left: 10px"></Badge>
        </DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: 'http://www.vlinkall.com/58240b9c31251cf86a07431b4a541b60.ico'
    },
    // messageUnreadCount: {
    //   type: Number,
    //   default: 0
    // }
  },
  mounted(){
    console.log(this.userAvator)
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    userinfo () {
      this.$router.push({
        name: 'userinfo'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'userinfo': this.userinfo()
          break
      }
    }
  }
}
</script>
