<template>
  <management
    ref="role"
    :table-columns="tableColumns"
    :data="{ table: '/api/role/list' }"
    page-name="角色"
    add-button="/api/role/ POST"
    refresh-button="/api/role/list GET"
    @submit="submit($event, '/api/role/')"
    @delete="deleteRow($event, '/api/role/')"
    @refresh="search('role')"
    @closeModal="modalindex = 'add'"
  >
    <Form
      :model="searchForm"
      inline
      :label-width="80"
      ref="searchForm"
      slot="searchForm"
    >
      <FormItem
        prop="name"
        label-for="role-search-form-name"
        label="角色名称"
      >
        <i-input
          type="text"
          element-id="role-search-form-name"
          v-model="searchForm.name"
          placeholder="输入角色名称搜索"
          style="width: 162px;"
        />
      </FormItem>
      <FormItem>
        <Button
          icon="md-search"
          type="primary"
          @click="search('role')"
          v-permission="'/api/role/list GET'"
        >搜索</Button>
        <Button
          icon="ios-redo"
          @click="$refs.searchForm.resetFields()"
          style="margin-left: 8px"
        >重置</Button>
      </FormItem>
    </Form>
    <Form
      :model="modalForm"
      inline
      :label-width="80"
      ref="modalForm"
      slot="modalForm"
      v-if="modalindex=='add'"
    >
      <Row>
        <Col span="8">
        <FormItem
          label="角色名称"
          label-for="role-modal-form1-name"
          prop="name"
        >
          <i-input
            type="text"
            element-id="role-modal-form1-name"
            v-model="modalForm.name"
            placeholder="角色名称"
          />
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem
          label="角色描述"
          label-for="role-modal-form1-description"
          prop="description"
        >
          <i-input
            type="text"
            element-id="role-modal-form1-description"
            v-model="modalForm.description"
            placeholder="角色描述"
          />
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem
          label="角色编码"
          label-for="role-modal-form1-description"
          prop="description"
        >
          <i-input
            type="text"
            element-id="role-modal-form1-description"
            v-model="modalForm.roleNo"
            placeholder="角色编码"
          />
        </FormItem>
        </Col>
      </Row>
    </Form>
    <Form
      :model="modalForm"
      inline
      :label-width="80"
      ref="modalForm"
      slot="modalForm"
      v-if="modalindex=='detail'"
    >
      <Row>
        <Col span="8">
        <FormItem
          label="角色名称"
          label-for="role-modal-form2-name"
          prop="name"
        >
          <i-input
            type="text"
            :disabled="true"
            element-id="role-modal-form2-name"
            v-model="modalForm.name"
            placeholder="角色名称"
          />
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem
          label="角色描述"
          label-for="role-modal-form2-description"
          prop="description"
        >
          <i-input
            type="text"
            :disabled="true"
            element-id="role-modal-form2-description"
            v-model="modalForm.description"
            placeholder="角色描述"
          />
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem
          label="角色编码"
          :disabled="true"
          label-for="role-modal-form2-description"
          prop="description"
        >
          <i-input
            type="text"
            :disabled="true"
            element-id="role-modal-form2-description"
            v-model="modalForm.roleNo"
            placeholder="角色编码"
          />
        </FormItem>
        </Col>
      </Row>
      <FormItem label="菜单">
        <Tree
          :data="treeData"
          ref="tree"
          :disabled="true"
        />
      </FormItem>
      <FormItem label="权限">
        <Table
          :columns="columns1"
          :data="tabeldata"
        ></Table>
      </FormItem>
    </Form>
    <Form
      :model="modalForm"
      inline
      :label-width="80"
      ref="modalForm"
      slot="modalForm"
      v-if="modalindex=='edit'"
    >
      <Row>
        <Col span="8">
        <FormItem
          label="角色名称"
          label-for="role-modal-form3-name"
          prop="name"
        >
          <i-input
            type="text"
            element-id="role-modal-form3-name"
            v-model="modalForm.name"
            placeholder="角色名称"
          />
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem
          label="角色描述"
          label-for="role-modal-form3-description"
          prop="description"
        >
          <i-input
            type="text"
            element-id="role-modal-form3-description"
            v-model="modalForm.description"
            placeholder="角色描述"
          />
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem
          label="角色编码"
          label-for="role-modal-form3-description"
          prop="description"
        >
          <i-input
            type="text"
            :disabled="true"
            element-id="role-modal-form3-description"
            v-model="modalForm.roleNo"
            placeholder="角色编码"
          />
        </FormItem>
        </Col>
      </Row>
      <FormItem label="菜单">
        <Tree
          :data="treeData"
          ref="tree"
          show-checkbox
          @on-check-change="choice"
        />
      </FormItem>
      <FormItem label="权限">
        <Transfer
          :data="data1"
          :target-keys="targetKeys1"
          :render-format="render1"
          :titles="['可配置权限','已有权限']"
          @on-change="handleChange1"
        ></Transfer>
      </FormItem>
    </Form>
  </management>
</template>

<script>
import management from "_c/management";
import { getInfo, setActivated } from "@/api/system-management";
import { buildTree, setSelectTreeByOwn} from "@/libs/util";
export default {
  name: "role",
  components: {
    management
  },
  data() {
    return {
      data1: [],
      treeData: [],
      tabeldata: [],
      targetKeys1: [],
      modalindex: "add",
      searchForm: {
        name: ""
      },
      columns1: [
        {
          title: "  请求方式",
          key: "requestType",
          tooltip: true
        },
        {
          title: "权限描述",
          key: "description",
          tooltip: true
        },
        {
          title: "url",
          key: "url",
          ooltip: true
        }
      ],
      tableColumns: [
        {
          title: "id",
          key: "id",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "角色名",
          key: "name",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "角色描述",
          key: "description",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "角色编号",
          key: "roleNo",
          tooltip: true,
          minWidth: 80
        },
        {
          title: "状态",
          key: "activated",
          minWidth: 80,
          tooltip: true,
          render: (h, { row }) => {
            return h("span", row.activated ? "启用" : "停用");
          }
        },
        {
          title: "创建时间",
          key: "createdDate",
          tooltip: true,
          minWidth: 100
        },
        {
          title: "最后修改时间",
          key: "lastModifiedDate",
          tooltip: true,
          minWidth: 100
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 80,
          tooltip: true
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          minWidth: 270,
          align: "center",
          render: (h, { row }) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.detail(row);
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/role/info/{id} GET"
                    }
                  ],
                  style: {
                    marginRight: "10px"
                  }
                },
                "详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.edit(row);
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/role/ PUT"
                    }
                  ],
                  style: {
                    marginRight: "10px"
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.$refs.role.delete(row);
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/role/ DELETE"
                    }
                  ],
                  style: {
                    marginRight: "10px"
                  }
                },
                "删除"
              ),
              h(
                "i-switch",
                {
                  props: {
                    size: "large",
                    value: !row.activated,
                    loading: row.activated_loading,
                    disabled:true
                  },
                  on: {
                    "on-change": value => {
                      this.changeActivated(row, value);
                    }
                  },
                  directives: [
                    {
                      name: "permission",
                      value: "/api/role/edit PUT"
                    }
                  ]
                },
                [
                  h("span", { slot: "open" }, "启用"),
                  h("span", { slot: "close" }, "停用")
                ]
              )
            ]);
          }
        }
      ],
      modalForm: {
        description: "",
        name: "",
        roleNo: ""
      }
    };
  },
  methods: {
    render1(item) {
      return item.description;
    },
    handleChange1(newTargetKeys) {
      // console.log(newTargetKeys);
      // console.log(direction);
      // console.log(moveKeys);
      this.targetKeys1 = newTargetKeys;
    },
    choice() {
      let select = this.$refs.tree.getCheckedAndIndeterminateNodes()
      let arr=[];
      for(var i=0;i<select.length;i++){
        arr.push(select[i].id)
      }
      this.menuIds = arr
      // console.log(this.menuIds)
    },
    search() {
      // 查询时，处理查询参数
      const param = Object.assign({}, this.searchForm);
      for (let i in param) {
        param[i] === "" && delete param[i];
      }
      this.$refs.role.setTableData(param);
    },
    submit(event, url) {
      // 添加和保存时，参数的处理
      let param = {};
        param.description = this.modalForm.description;
        param.name = this.modalForm.name;
      if (this.modalindex == "add") {
        param.roleNo = this.modalForm.roleNo;
      }else{
        url = '/api/role/edit'
        param.permissionIds = this.targetKeys1
        param.id = this.modalForm.id
        if(this.menuIds){
          param.menuIds = this.menuIds.slice(1)
        }
      }
      // param.pid = event.pid;
      event.request(url, param, param.id ? "put" : "post");
    },
    deleteRow(request) {
      request("/api/role/");
    },
    detail({ id }) {
      // 查看详情时，表单的回显
      this.modalindex = "detail";
      getInfo("/api/role/info/" + id)
        .then(data => {
          Object.assign(this.modalForm, data, {
            activated: data.activated ? 1 : 0
          });
          let treeList = buildTree(this.modalForm.menus);
          setSelectTreeByOwn(treeList, true);
          this.treeData = treeList;          
          if(this.treeData[0].children.length == '0'){
            this.treeData = []
          }
          this.tabeldata = Object.assign([], this.modalForm.permissions);
          this.$refs.role.detail();
        })
        .catch(error => {
          this.$Notice.error({
            title: "获取详情失败",
            desc: error
          });
        });
    },
    edit({ id }) {
      // 编辑时，表单的回显
      this.modalindex = "edit";
      getInfo("/api/role/edit-info/" + id)
        .then(data => {
          Object.assign(this.modalForm, data, {
            activated: data.activated ? 1 : 0
          });
          console.log(this.modalForm.distributablePermissions.length)
          let treeList = buildTree(this.modalForm.menus);
          setSelectTreeByOwn(treeList, true);
          this.treeData = treeList; 
          let mockdata = [], mockdata1 = [], mockeys = [];
          for (
            let i = 0;
            i < this.modalForm.distributablePermissions.length;
            i++
          ) {
            mockdata.push({
              key: this.modalForm.distributablePermissions[i].id,
              description: this.modalForm.distributablePermissions[i]
                .description
            });
          }
          this.data1 = Object.assign([], mockdata); 
           for (
            let j = 0;
            j < this.modalForm.permissions.length;
            j++
          ) {
            mockdata1.push({
              key: this.modalForm.permissions[j].id,
              description: this.modalForm.permissions[j]
                .description
            });
            mockeys.push(
             this.modalForm.permissions[j].id,
            );
          }
          this.data1 = this.data1.concat(mockdata1)
          this.targetKeys1 = Object.assign([], mockeys);
           mockdata = mockdata1 = mockeys = [];
          this.$refs.role.edit();
        })
        .catch(error => {
          this.$Notice.error({
            title: "打开编辑失败",
            desc: error
          });
        });
    },
    changeActivated(row, value) {
      row.activated = !value;
      this.$set(row, "activated_loading", true);
      setActivated("/api/role/edit", row)
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
};
</script>
