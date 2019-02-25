<template>
  <div>
    <Form
      :model="userinfo"
      :label-width="80"
      style="width:70%;margin:0 auto"
    >
      <FormItem
        label="账号"
        prop="username"
      >
        <input
          type="text"
          disabled
          style="width:176px;border:none"
          v-model="userinfo.username"
        >
      </FormItem>
      <FormItem
        label="姓氏"
        prop="firstName"
      >
        <input
          type="text"
          disabled
          v-model="userinfo.firstName"
        >
      </FormItem>
      <FormItem
        label="名字"
        prop="lastName"
      >
        <input
          type="text"
          disabled
          v-model="userinfo.lastName"
        >
      </FormItem>
      <FormItem
        label="手机号"
        prop="mobile"
      >
        <input
          type="text"
          disabled
          v-model="userinfo.mobile"
        >
      </FormItem>
      <FormItem
        label="邮箱"
        prop="email"
      >
        <input
          type="text"
          disabled
          v-model="userinfo.email"
        >
      </FormItem>
      <FormItem
        label="性别"
        prop="label"
      >
        <RadioGroup v-model="userinfo.gender.label">
          <Radio
            label="未知"
            disabled
          ></Radio>
          <Radio
            label="男"
            disabled
          ></Radio>
          <Radio
            label="女"
            disabled
          ></Radio>
        </RadioGroup>
      </FormItem>
      <FormItem
        label="头像"
        prop="avatar"
      >
        <img
          :src="userinfo.avatar"
          style="width: 58px;height:58px;line-height: 58px;"
          v-if="userinfo.avatar"
        >
        <img
          :src="userinfo.avatar"
          style="width: 58px;height:58px;line-height: 58px;"
          v-else
        >
        <Upload
          ref="upload"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          type="drag"
          action=""
          style="display: inline-block;width:102px;"
        >
          <Button
            type="primary"
            disabled
            icon="ios-cloud-upload"
          >上传头像</Button>
        </Upload>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/user";
export default {
  name: "userinfo",
  data() {
    return {
      userinfo: {
        username: "",
        gender: {}
      }
    };
  },
  created() {
    getUserInfo().then(data => {
      this.userinfo = data;
    });
  },
  mounted() {},
  methods: {
    handleSuccess(res, file) {
      // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
      // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
      console.log(res);
      console.log(file);
    },
    handleFormatError() {
      this.$Notice.warning({
        title: "图片上传失败",
        desc: "图片仅支持'jpg','jpeg','png'格式"
      });
    },
    handleMaxSize() {
      this.$Notice.warning({
        title: "图片上传失败",
        desc: "图片大小不能超过 2M"
      });
    }
  }
};
</script>
