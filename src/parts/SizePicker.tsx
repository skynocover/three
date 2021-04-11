import React, { Component, useContext, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
// import '../App.css';
import { ColumnsType } from 'antd/es/table';
import { AppContext, blockSettings } from '../appcontext';

import { Table, Input, Button, Popconfirm, Form, Typography, InputNumber } from 'antd';
const { Text } = Typography;
interface Size {
  width: number;
  height: number;
  length: number;
}

const SizePicker = () => {
  const appCtx = React.useContext(AppContext);

  const [data, setDataSource] = React.useState<Size[]>([
    { width: appCtx.width[0], height: appCtx.width[1], length: appCtx.width[2] },
  ]);
  React.useEffect(() => {
    // console.log('11111');
    // console.log({ width: appCtx.width[0], height: appCtx.width[1], length: appCtx.width[2] });
    // setDataSource([{ width: appCtx.width[0], height: appCtx.width[1], length: appCtx.width[2] }]);
  }, []);

  const onChange = (t: string, value: number) => {
    console.log(`data: ${JSON.stringify(appCtx.width)}`);
    switch (t) {
      case 'width':
        setDataSource((preState: Size[]) => {
          let temp = [...preState];
          temp[0].width = value;
          return temp;
        });
        appCtx.setWidth((preState: number[]) => {
          let temp = [...preState];
          temp[0] = value;
          return temp;
        });
        break;
      case 'height':
        setDataSource((preState: Size[]) => {
          let temp = [...preState];
          temp[0].height = value;
          return temp;
        });
        appCtx.setWidth((preState: number[]) => {
          let temp = [...preState];
          temp[1] = value;
          return temp;
        });
        break;

      default:
        setDataSource((preState: Size[]) => {
          let temp = [...preState];
          temp[0].length = value;
          return temp;
        });
        appCtx.setWidth((preState: number[]) => {
          let temp = [...preState];
          temp[2] = value;
          return temp;
        });
        break;
    }
  };

  let columns: ColumnsType<Size> = [
    {
      title: 'width',
      align: 'center',
      width: 80,
      render: (item: Size) => {
        return (
          <InputNumber
            min={1}
            defaultValue={item.width}
            onChange={(value) => onChange('width', value)}
          />
        );
      },
    },
    {
      title: 'height',
      align: 'center',
      width: 80,
      render: (item: Size) => {
        return (
          <InputNumber
            min={1}
            defaultValue={item.height}
            onChange={(value) => onChange('height', value)}
          />
        );
      },
    },
    {
      title: 'length',
      align: 'center',
      width: 80,
      render: (item: Size) => {
        return (
          <InputNumber
            min={1}
            defaultValue={item.length}
            onChange={(value) => onChange('length', value)}
          />
        );
      },
    },
  ];

  return (
    <>
      <Table
        bordered
        dataSource={data}
        columns={columns}
        pagination={false}
        summary={() => {
          let target = appCtx.width[0] * appCtx.width[1] * appCtx.width[2];

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total blocks</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text>{target}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </>
  );
};

export default SizePicker;
