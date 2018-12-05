<template>
  <Form ref="formValidate" :model="formValidate" :label-width="80">
    <FormItem label="Name" prop="name">
      <Input v-model="formValidate.name" placeholder="Enter your name" />
    </FormItem>
    <FormItem label="E-mail" prop="mail">
      <Input v-model="formValidate.mail" placeholder="Enter your e-mail" />
    </FormItem>
    <FormItem label="City" prop="city">
      <Select v-model="formValidate.city" placeholder="Select your city">
        <Option value="beijing">New York</Option>
        <Option value="shanghai">London</Option>
        <Option value="shenzhen">Sydney</Option>
      </Select>
    </FormItem>
  </Form>
</template>

<script>
export default {
  name: 'vlinkForm',
  data() {
    return {
      formValidate: {
        name: '',
        mail: '',
        city: ''
      }
    }
  }
};
</script>

<style lang="less">
</style>
