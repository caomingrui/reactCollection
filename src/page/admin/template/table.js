import React, {memo, useContext, useEffect, useState} from "react";
import {AppContext, ChildCont} from "../../collectPlay";
import {Table, Switch, Space} from "antd";

// 基本表格组件
export default memo((props) => {

    return(
        <div>
            <Table columns={props.columns} dataSource={props.data} />
        </div>
    );
})

// 多层表格组件
export const MultiLayerTable = (props) => {

    const [checkStrictly, setCheckStrictly] = useState(false);
    // rowSelection objects indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
    };

    return (
        <>
            <Table
                columns={props.columns}
                rowSelection={{ ...rowSelection, checkStrictly }}
                dataSource={props.data}
            />
        </>
    );
}
