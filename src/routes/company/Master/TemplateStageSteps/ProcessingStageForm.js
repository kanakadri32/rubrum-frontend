import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import { camelCase } from 'lodash';
import moment from 'moment';
import {Button, Card, Divider, Table, Modal, Row, Col, Form, Input, Icon, Tabs, Radio, DatePicker} from "antd";
import CreateForm from './../CreateField';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
let uuid = 0;
export const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},
        md: {span: 16},
    },
};

const ProcessingStageForm = (props) => {

    const [showSlitAddParameter, setshowSlitAddParameter] = useState(false);
    const [showCutAddParameter, setshowCutAddParameter] = useState(false);

   return (
    <>
        <Col span={18} className="login-form gx-pt-4">
            <Button type="primary" icon={() => <i className="icon icon-add"/>} size="medium"
                    onClick={() => {
                        setshowSlitAddParameter(true);
                    }}
            >Create Slit Form</Button>
            <Button type="primary" icon={() => <i className="icon icon-add"/>} size="medium"
                    onClick={() => {
                        setshowCutAddParameter(true);
                    }}
            >Create Cut Form</Button>
            <Form {...formItemLayout}  className="login-form gx-pt-4">
                { props.formFields && Object.keys(props.formFields)?.map((value, index) => {
                    const field = props.formFields[value];
                    let inputEle = null;
                    if (field.type === 'calendar') {
                            inputEle = (
                                <DatePicker
                                    style={{width: 250}}
                                    className="gx-mb-3 gx-w-200"
                                    format='DD/MM/YYYY'
                                    defaultValue={moment(new Date(), 'DD/MM/YYYY')}
                                />
                            )
                    }
                    else if (field.type === 'radio') {
                            const options = field.options.split(',') || [];
                            inputEle = (
                                <Radio.Group defaultValue={field.default}>
                                    {options.map((item, index) => (
                                        <Radio value={camelCase(item)} key={index}>{item}</Radio>
                                    ))}
                                </Radio.Group>
                            );
                    } else if (field.type === 'textArea') {
                            inputEle = (
                                <Input.TextArea type={field.type} max={field.max} min={field.min} defaultValue={field.default}>
                                </Input.TextArea>
                            )
                    } else {
                        inputEle = (
                            <Input type={field.type} max={field.max} min={field.min} defaultValue={field.default}>
                            </Input>
                        );
                    }
                    return (
                        <FormItem key={index} label={field.value}>
                            {inputEle && inputEle}
                        </FormItem>
                    )
                })}
            </Form>
            <CreateForm setshowAddParameter={setshowSlitAddParameter} showAddParameter={showSlitAddParameter} />
            <CreateForm setshowAddParameter={setshowCutAddParameter} showAddParameter={showCutAddParameter} />
            <Button style={{ marginLeft: 8 }} onClick={() => props.updateStep(1)}>
                <Icon type="left"/>Back
            </Button>
            <Button type="primary" htmlType="submit">
                Forward<Icon type="right"/>
            </Button>
        </Col>
    </>
   );
};

const mapStateToProps = state => ({
    formFields: state.quality.formFields
});

export default connect(mapStateToProps)(ProcessingStageForm);