import React, { Component, useContext, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
// import '../App.css';

import { AppContext, blockSettings } from '../appcontext';

import { Table, Input, Button, Popconfirm, Form, Typography } from 'antd';
import { FormInstance } from 'antd/lib/form';

import ColorPicker from '../parts/ColorPicker';
import SizePicker from '../parts/SizePicker';

const { Text } = Typography;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof blockSettings;
  record: blockSettings;
  handleSave: (record: blockSettings) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<Input>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  age: string;
  address: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

interface EditableRowProps {
  index: number;
}

const DashBoard = () => {
  const appCtx = React.useContext(AppContext);

  const [setting, setSetting] = React.useState<blockSettings[]>([]);
  React.useEffect(() => {
    setSetting(appCtx.blocks);
  }, []);

  const tackColor = (index: number, color: any) => {
    setSetting((preState: blockSettings[]) => {
      let temp = preState;
      temp[index].colors = color;
      return temp;
    });
  };

  const refresh = () => {
    appCtx.setBlocks(setting);
    appCtx.setRefresh(!appCtx.refresh);
  };

  let columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: 100,
      editable: true,
    },
    {
      title: 'color',
      width: 80,
      align: 'center',
      render: (item: blockSettings) => {
        return <ColorPicker color={item.colors} tackColor={tackColor} index={item.key} />;
      },
    },
    {
      title: 'number',
      dataIndex: 'num',
      editable: true,
      width: 80,
    },
    {
      title: 'delete',
      dataIndex: 'operation',
      width: 80,
      align: 'center',
      render: (_: any, record: { key: React.Key }) =>
        setting.length >= 1 ? <a onClick={() => handleDelete(record.key)}>Delete</a> : null,
    },
  ];

  const handleDelete = (key: React.Key) => {
    const dataSource = [...setting];
    setSetting(dataSource.filter((item) => item.key !== key));
  };

  const newSetting = () => {
    setSetting((preState: blockSettings[]) => {
      return [
        ...preState,
        {
          key: preState[preState.length - 1].key + 1,
          name: `newColor${preState[preState.length - 1].key + 1}`,
          colors: 0x080820,
          num: 0,
        },
      ];
    });
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleSave = (row: blockSettings) => {
    if (isNaN(row.num)) {
      alert(`${row.num} is not a number`);
      return;
    }
    const newData = [...setting];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setSetting(newData);
  };

  columns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <>
      <SizePicker />
      <Button onClick={newSetting} type="primary" style={{ marginTop: 5 }}>
        Add one color
      </Button>
      <Button onClick={refresh} type="primary">
        Refresh
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        dataSource={setting}
        columns={columns as ColumnTypes}
        pagination={false}
        summary={(pageData) => {
          let totalNumber = 0;

          pageData.forEach((item: any) => {
            totalNumber += Number(item.num);
          });
          console.log(`width: ${JSON.stringify(appCtx.width)}`);
          let target = appCtx.width[0] * appCtx.width[1] * appCtx.width[2];
          console.log(`target: ${target}, total number: ${totalNumber}`);

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>diff</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  {target !== totalNumber ? (
                    <Text type="danger">{target - totalNumber}</Text>
                  ) : (
                    <Text>{0}</Text>
                  )}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </>
  );
};

export default DashBoard;
