import React, {memo, useEffect, useState} from "react";
import styled from 'styled-components';
import { Form, Input, InputNumber, Button, Upload, message } from 'antd';
import Table, { MultiLayerTable } from '../template/table';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const PersonStyle = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  
  .echoView {
    width: 43%;
    min-height: 600px;
    background-color: #ffffff;
    padding: 20px;
  }
`;

export default memo(() => {

    return (
        <PersonStyle>
            <UserSetting></UserSetting>
            <div className="echoView">

            </div>
        </PersonStyle>
    );
});


// 用户信息设置
const SetStyle = styled.div`
  width: 55%;
  max-height: 300px;
  background-color: #ffffff;
  padding: 20px;
  
  .setting-cont {
    width: 100%;
    display: flex;
    justify-content: space-between;
    
    >div, form {
      flex: 1;
    }

    .ant-form-item-label {
      text-align: left;
    }
  }
`;

const UserSetting = () => {

    return (
        <SetStyle>
            <p>基本设置</p>
            <div className="setting-cont">
                <Demo></Demo>
                <div>
                    <Avatar></Avatar>
                </div>
            </div>
        </SetStyle>
    );
}

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

const Demo = () => {
    const onFinish = values => {
        console.log(values);
    };

    return (
        <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
            <Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email' }]}>
                <Input />
            </Form.Item>
            <Form.Item name={['user', 'introduction']} label="Introduction">
                <Input.TextArea />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};



function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

class Avatar extends React.Component {
    state = {
        loading: false,
    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    render() {
        const { loading, imageUrl } = this.state;
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
        );
    }
}
