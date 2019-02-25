import {
  getInfo,
  setActivated
} from "@/api/system-management";

export default {
  methods: {
    submit(event, url) {
      // 添加和保存时，参数的处理
      let param = Object.assign({}, this.modalForm);
      console.log(this.modalForm)
      if(param.roles){
        param.roleIds = param.roles
      }
      param.parentId = param.pid = event.pid;
      event.request(url, param, param.id ? "put" : "post");
    },
    deleteRow(request, url) {
      request(url);
    },
    edit(url, name = 'page') {
      // 编辑时，表单的回显
      getInfo(url)
        .then(data => {
          Object.assign(this.modalForm, data, {
            activated: data.activated ? 1 : 0
          });
          if (this.modalForm.gender) {
            this.modalForm.gender = data.gender.value
          }
          if (this.modalForm.roles) {
            let list = this.modalForm.roles.reduce((val,item) => val + ',' + item.id, '').split(',').filter(item => item)
            this.modalForm.roles = list
            list=[]
          }
          console.log(this.modalForm.roles)
          this.$refs[name].edit();
        })
        .catch(error => {
          this.$Notice.error({
            title: "打开编辑失败",
            desc: error
          });
        });
    },
    search(name = 'page') {
      // 查询时，处理查询参数
      const param = Object.assign({}, this.searchForm);
      for (let i in param) {
        param[i] === "" && delete param[i];
      }
      this.$refs[name].setTableData(param);
    },
    changeActivated(row, value, url) {
      row.activated = !value;
      this.$set(row, "activated_loading", true);
      setActivated(url, row)
        .then(() => {
          this.$set(row, "activated_loading", false);
        })
        .catch(error => {
          row.activated = value;
          this.$set(row, "activated_loading", false);
          this.$Notice.error({
            title: "状态修改失败",
            desc: error
          });
        });
    }
  }
}