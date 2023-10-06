import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { Button, Select, Table } from 'antd';
import { useIntl } from "react-intl";
import SearchBox from '../../../../components/SearchBox';
import IntlMessages from '../../../../util/IntlMessages';

import {
    fetchKqpLinkList,
    fetchKqpLinkListSuccess
} from "../../../../appRedux/actions";

const LinkedTemplateList = (props) => {

    const { actions } = props;
    const intl = useIntl();
    const [searchValue, setSearchValue] = useState("");
    const [pageNo, setPageNo] = useState(1);
    const [totalPageItems, setTotalItems] = useState(0);
    const [templateList, setTemplateList] = useState([]);


    useEffect(() => {
        console.log("init")
        setTemplateList([]);
        setSearchValue([]);
        setPageNo([]);
    }, []);

    useEffect(() => {
        console.log("data load")
        props.fetchKqpLinkList();
    }, []);

   

    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation === 'kqpLinkList') {
            console.log(props.template)
            setTemplateList(props.template.data)
        }
    }, [props.template.loading, props.template.error]);

    useEffect(() => {
        if (searchValue) {
            if (searchValue.length >= 3) {
                setPageNo(1);
                // props.fetchInwardList(1, 20, searchValue, customerValue);
            }
        } else {
            setPageNo(1);
            //   props.fetchInwardList(1, 20, searchValue, customerValue);
        }
    }, [searchValue]);

    const handleChange = () => {

    }

    const rowSelection = {}

    return (
        <>
            <div className="gx-flex-row gx-flex-1">
                <div className="table-operations gx-col">
                    {actions.search && <SearchBox
                        styleName="gx-flex-1"
                        placeholder={intl.formatMessage({ id: actions.search.placeholder })}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}>
                    </SearchBox>}

                </div>
                <div className="gx-w-50">
                    {actions.export && <Button
                        size="medium"
                        className="gx-float-right"
                    >
                        {intl.formatMessage({ id: actions.export.label })}
                    </Button>}
                    {actions.print && <Button
                        size="medium"
                        className="gx-float-right"
                    >
                        {intl.formatMessage({ id: actions.print.label })}
                    </Button>}
                </div>
            </div>
            <Table
                className="gx-table-responsive"
                columns={props.columns}
                dataSource={templateList}
                onChange={handleChange}
                rowSelection={rowSelection}
                pagination={{
                    pageSize: "15",
                    onChange: (page) => {
                        setPageNo(page);
                        props.fetchTemplatesList(page, 15, searchValue);
                    },
                    current: pageNo,
                    total: totalPageItems,
                }}
            />
        </>
    )
}

const mapStateToProps = (state) => ({
    template: state.quality,
});

export default connect(mapStateToProps, {
    fetchKqpLinkList,
    fetchKqpLinkListSuccess
})(LinkedTemplateList);