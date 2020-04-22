import React, { useState, useEffect } from "react";
import intl from "react-intl-universal";
import {
  Table,
  Button,
  Drawer,
  Form,
  notification,
  ConfigProvider,
} from "antd";
import { connect } from "dva";
import { renderInstruct } from "./program_instruct_header";
import ConTitle from "components/title";
import ChangeInstructValue from "./program_changevalue_header";
import ProgramComponent from "../../components/project/programcomponent";
import "./Project.css";
import { sendMSGtoServer } from "service/network";

// 从全局的状态获取当前机器人状态
const mapStateToProps = (state) => {
  return {
    currentRobot: state.index.robotStatus.currentRobot,
    robot1OpenedProgram: state.App.robot1OpenedProgram,
    robot2OpenedProgram: state.App.robot2OpenedProgram,
    robot3OpenedProgram: state.App.robot3OpenedProgram,
    robot4OpenedProgram: state.App.robot4OpenedProgram,
    program: state.index.program,
  };
};
// 空状态
const customizeRenderEmpty = () => (
  <div style={{ textAlign: "center" }}>
    <p>空程序，请插入指令</p>
  </div>
);

// 工程界面组件

function Program(props) {
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedName, setSelectedName] = useState(0);
  const [changeVisible, setChangeVisible] = useState(false);
  const [dataSourceMain, setDataSourceMain] = useState([]);
  const [insertOrChange, setInsertOrChange] = useState("insert");
  const [form] = Form.useForm();
  // 用来构建标签页
  const columns = [
    {
      dataIndex: "order",
      key: "order",
      className: "pro_id",
    },
    {
      title: "指令名",
      dataIndex: "name",
      key: "name",
      className: "pro_tit",
      render: (text) => (
        <div className='instructName' type={{ color: "FF00FF" }}>
          {text}
        </div>
      ),
    },
    {
      title: intl.get("参数"),
      dataIndex: "para",
      key: "para",
    },
  ];
  useEffect(() => {
    if (props.program.success === false) {
      notification.error({
        message: `打开文件失败！`,
        description: `打开文件${props.program.name}失败！原因可能为解析失败`,
      });
      return;
    } else {
      let instruct = props.program.instruct;
      let keyOfInstruct = 1;
      // 标签页内表格的表头
      let dataSource = [];
      if (instruct === undefined) {
        dataSource = [];
      } else {
        // 遍历获取指令数据
        instruct.map((value, index) => {
          if (index === 0) {
            return;
          } else {
            if (value === null) {
              dataSource.push({
                key: keyOfInstruct,
                order: keyOfInstruct,
                name: "未解析指令",
                para: "未解析指令",
                insName: "未解析指令",
              });
            } else {
              dataSource.push({
                key: keyOfInstruct,
                order: keyOfInstruct,
                name: intl.get(value.name),
                para: renderInstruct(value.name, value.para),
                insName: value.name,
              });
            }
            keyOfInstruct = keyOfInstruct + 1;
            return value;
          }
        });
      }
      setDataSourceMain(dataSource);
    }
  }, [props.program]);

  

  return (
    <div>
      {/* 主界面 */}
      <ConTitle
        title={`${intl.get("程序")} ${props.program.name}`}
        subtitle={intl.get(" ")}
        buttonLink='/Project'
      />
      <ProgramComponent selectedName={selectedName} selectedRow={selectedRow} />
      <ConfigProvider renderEmpty={customizeRenderEmpty}>
        <Table
          dataSource={dataSourceMain}
          columns={columns}
          /* scroll={
          {y:"500px"}
        } */
          pagination={false}
          onRow={(record) => {
            return {
              // 点击表格每一行后的回调
              onClick: (event) => {
                console.log(record.order, record.insName);
                setSelectedRow(record.order);
                setSelectedName(record.insName);
              },
            };
          }}
        />
      </ConfigProvider>
    </div>
  );
}
export default connect(mapStateToProps)(Program);
