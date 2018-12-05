<template>
  <div style="height: 100%;">
    <Row style="height: 100%;">
      <Col span="4" style="background-color: white; height: 100%; overflow: auto;">
        <Tree :data="data1"></Tree>
      </Col>
      <Col span="1">&nbsp;</Col>
      <Col span="19" style="background-color: white; height: 100%;" ref="tableContainer">
        <div style="text-align: right; margin: 10px;">
          <Button type="success" icon="md-add" @click="add">添加</Button>
        </div>
        <Table
          size="small"
          :height="tableHeight"
          :columns="columns1"
          :data="data2"
          no-data-text="暂无数据"
        ></Table>
        <div style="margin: 10px; overflow: hidden;">
          <Select v-model="model1" style="float: right; width: 82px; margin-left: 10px;">
            <Option value="1">10条/页</Option>
            <Option value="2">20条/页</Option>
            <Option value="3">30条/页</Option>
            <Option value="4">40条/页</Option>
            <Option value="5">999条/页</Option>
          </Select>
          <div style="float: right; height: 32px; line-height: 32px; margin-left: 10px;">共{{rows}}条</div>
          <Page :total="100" :current="1" @on-change="changePage" style="float: right;"></Page>
        </div>
      </Col>
    </Row>
    <Modal
      v-model="modalModal"
      :title="titleModal"
      :loading="true"
      :closable="closable"
      :mask-closable="false"
      class-name="form-modal"
      @on-ok="okModal"
    >
      <Form :model="formItem" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="Input">
              <Input v-model="formItem.input" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="Select">
              <Select v-model="formItem.select">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="DatePicker">
          <Row>
            <Col span="11">
              <DatePicker type="date" placeholder="Select date" v-model="formItem.date"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <TimePicker type="time" placeholder="Select time" v-model="formItem.time"></TimePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="Radio">
          <RadioGroup v-model="formItem.radio">
            <Radio label="male">Male</Radio>
            <Radio label="female">Female</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="Checkbox">
          <CheckboxGroup v-model="formItem.checkbox">
            <Checkbox label="Eat"></Checkbox>
            <Checkbox label="Sleep"></Checkbox>
            <Checkbox label="Run"></Checkbox>
            <Checkbox label="Movie"></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="Switch">
          <i-switch v-model="formItem.switch" size="large">
            <span slot="open">On</span>
            <span slot="close">Off</span>
          </i-switch>
        </FormItem>
        <FormItem label="Slider">
          <Slider v-model="formItem.slider" range></Slider>
        </FormItem>
        <FormItem label="Text">
          <Input
            v-model="formItem.textarea"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="Enter something..."
          ></Input>
        </FormItem>
        <FormItem>
          <Button type="primary">Submit</Button>
          <Button style="margin-left: 8px">Cancel</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "organization_page",
  data() {
    return {
      tableHeight: "0",
      model1: "1",
      rows: 100,
      modalModal: false,
      closable: true,
      titleModal: "",
      data1: [
        {
          title: "parent 1",
          expand: true,
          children: [
            {
              title: "parent 1-1-1-2-3-4-5sdsdsd杀杀杀",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1"
                },
                {
                  title: "leaf 1-2-1"
                }
              ]
            }
          ]
        }
      ],
      columns1: [
        {
          title: "Name",
          key: "name",
          width: 520,
          tooltip: true
        },
        {
          title: "Age",
          key: "age",
          width: 620,
          tooltip: true
        },
        {
          title: "Age",
          key: "age",
          width: 220,
          tooltip: true
        },
        {
          title: "Address",
          key: "address",
          width: 100,
          tooltip: true
        },
        {
          title: "Action",
          key: "action",
          fixed: "right",
          width: 200,
          render: (h, { row }) => {
            return h("div", [
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
                    type: "warning",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.state(row);
                    }
                  },
                  style: {
                    marginRight: "10px"
                  }
                },
                "停用"
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
                      this.delete(row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data2: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        },
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        }
      ],
      formItem: {
        input: "",
        select: "",
        radio: "male",
        checkbox: [],
        switch: true,
        date: "",
        time: "",
        slider: [20, 50],
        textarea: ""
      }
    };
  },
  mounted() {
    setTimeout(() => {
      this.tableHeight = this.$refs.tableContainer.$el.offsetHeight - 105;
    });
    this.resizeArray.push(() => {
      this.tableHeight = this.$refs.tableContainer.$el.offsetHeight - 105;
    });
  },
  methods: {
    changePage() {},
    edit() {
      this.titleModal = "编辑";
      this.modalModal = true;
    },
    state() {},
    delete(row) {
      this.$Modal.confirm({
        title: "确定删除",
        loading: true,
        onOk() {
          console.log(row);
          let cancelBuuton = document.getElementsByClassName(
            "ivu-modal-confirm-footer"
          )[0].children[0];
          cancelBuuton.setAttribute("disabled", "disabled");
          setTimeout(() => {
            cancelBuuton.removeAttribute("disabled");
            this.$Modal.remove();
          }, 1000);
        }
      });
    },
    add() {
      this.titleModal = "添加";
      this.modalModal = true;
    },
    okModal() {
      this.closable = false;
      let cancelBuuton = document.getElementsByClassName("form-modal")[0]
        .children[0].children[0].children[3].children[0];
      cancelBuuton.setAttribute("disabled", "disabled");
      setTimeout(() => {
        cancelBuuton.removeAttribute("disabled");
        this.closable = true;
        this.modalModal = false;
      }, 3000);
    },
    cancelModal() {}
  }
};
</script>

<style>
</style>
