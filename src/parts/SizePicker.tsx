import React, { Component, useContext, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
// import '../App.css';
import { ColumnsType } from 'antd/es/table';
import { AppContext, blockSettings, Size } from '../appcontext';

import { Table, Input, Button, Popconfirm, Form, Typography, InputNumber } from 'antd';
const { Text } = Typography;

const SizePicker = () => {
  const appCtx = React.useContext(AppContext);

  const [data, setDataSource] = React.useState<Size[]>([appCtx.size]);
  React.useEffect(() => {
    // console.log('11111');
    // console.log({ width: appCtx.width[0], height: appCtx.width[1], length: appCtx.width[2] });
    // setDataSource([{ width: appCtx.width[0], height: appCtx.width[1], length: appCtx.width[2] }]);
  }, []);

  const onChange = (t: string, value: number) => {
    // console.log(`data: ${JSON.stringify(appCtx.size)}`);
    switch (t) {
      case 'width':
        setDataSource((preState: Size[]) => {
          let temp = [...preState];
          temp[0].X = value;
          return temp;
        });
        appCtx.setSize((preState: Size) => {
          let temp = { ...preState };
          temp.X = value;
          return temp;
        });
        break;
      case 'height':
        setDataSource((preState: Size[]) => {
          let temp = [...preState];
          temp[0].Y = value;
          return temp;
        });
        appCtx.setSize((preState: Size) => {
          let temp = { ...preState };
          temp.Y = value;
          return temp;
        });
        break;

      default:
        setDataSource((preState: Size[]) => {
          let temp = [...preState];
          temp[0].Z = value;
          return temp;
        });
        appCtx.setSize((preState: Size) => {
          let temp = { ...preState };
          temp.Z = value;
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
            defaultValue={item.X}
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
            defaultValue={item.Y}
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
            defaultValue={item.Z}
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
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total blocks</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text>{appCtx.size.X * appCtx.size.Y * appCtx.size.Z}</Text>
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
