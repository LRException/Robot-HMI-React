import React from "react";
import intl from "react-intl-universal";
import "./index.css";
import { Select } from "antd";
import { connect } from "dva";
import { useEffect } from "react";
import { useState } from "react";
import { sendMSGtoController } from "service/network";

const { Option } = Select;

function handleChangeOperatemode(value) {
  console.log(`selected ${value}`);
}

const mapStateToProps = state => {
  return {
    operaMode: state.index.robotStatus.operaMode
  };
};

function Mode(props) {
  const [mode, setMode] = useState("Teach");
  useEffect(() => {
    switch (props.operaMode) {
      case 0:
        setMode("Teach");
        break;
      case 1:
        setMode("Remote");
        break;
      case 2:
        setMode("Run");
        break;
        default:
          break;
    }
  }, [props.operaMode]);
  const handleChangemode = value => {
    switch (value) {
      case "Teach":
        let data1 = {
          mode: 0
        };
        sendMSGtoController("OPERATION_MODE_SET", data1);
        break;
      case "Run":
        let data2 = {
          mode: 2
        };
        sendMSGtoController("OPERATION_MODE_SET", data2);
        break;
      case "Remote":
        let data3 = {
          mode: 1
        };
        sendMSGtoController("OPERATION_MODE_SET", data3);
        break;
      default:
        console.error("模式", value, "错误");
        break;
    }
  };
  return (
    <div>
      <Select
        value={mode}
        onChange={handleChangemode}
        showArrow={false}
        className="Teach"
        style={{width:80}}
      >
        <Option value="Teach">{intl.get("示教模式")}</Option>
        <Option value="Run">{intl.get("运行模式")}</Option>
        <Option value="Remote">{intl.get("远程模式")}</Option>
      </Select>
      <Select
        defaultValue="Handle"
        onChange={handleChangeOperatemode}
        showArrow={false}
        className="Handle"
        style={{width:52}}
      >
        <Option value="Handle">{intl.get("手动")}</Option>
        <Option value="Wheel">{intl.get("手轮")}</Option>
        <Option value="Drag">{intl.get("拖拽")}</Option>
      </Select>
    </div>
  );
}
export default connect(mapStateToProps)(Mode);
