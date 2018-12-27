<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="code" style="display:inlinebolck">
      <Row>
        <Col span="12">
          <Input type="text" v-model="form.code" placeholder="请输入验证码">
            <span slot="prepend">
              <Icon :size="14" type="md-key"></Icon>
            </span>
          </Input>
        </Col>
        <Col span="7" style="height: 32px;">
          <img :src="url" @click="changecode" height="32" style="cursor: pointer;padding-left:2px">
        </Col>
        <Col span="5">
          <span class="changecode" @click="changecode" style="padding-left:5px">换一换</span>
        </Col>
      </Row>
    </FormItem>
    <FormItem :style="{ marginBottom: error ? '10px' : '24px' }">
      <Button @click="handleSubmit" type="primary" :loading="loading" long>登录</Button>
    </FormItem>
    <Alert type="error" v-if="error" style="margin-bottom: 0;">{{error}}</Alert>
  </Form>
</template>
<script>
import config from "@/config";
import { getUniqueId } from "@/api/user";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;
export default {
  name: "LoginForm",
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "账号不能为空", trigger: "blur" }];
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "密码不能为空", trigger: "blur" }];
      }
    },
    codeRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "验证码不能为空", trigger: "blur" }];
      }
    },
    error: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      url: "",
      uniqueId: "",
      form: {
        userName: "admin",
        password: "",
        code: ""
      },
      loading: false
    };
  },
  computed: {
    rules() {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
        code: this.codeRules
      };
    }
  },
  created() {
    getUniqueId()
      .then(uniqueId => {
        this.uniqueId = uniqueId;
        this.url = `${baseUrl}/api/captcha?captchaKey=${uniqueId}&${Date.now()}`;
      })
      .catch(error => {
        this.$Notice.error({
          title: '获取验证码失败，请刷新页面重试',
          desc: error
        });
      });
  },
  methods: {
    changecode() {
      this.url = `${baseUrl}/api/captcha?captchaKey=${
        this.uniqueId
      }&${Date.now()}`;
    },
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$emit("on-success-valid", {
            userName: this.form.userName,
            password: this.form.password,
            code: this.form.code,
            uniqueId: this.uniqueId,
            callback: () => {
              this.loading = false;
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.changecode:hover {
  color: #57a3f3;
  cursor: pointer;
}
</style>
