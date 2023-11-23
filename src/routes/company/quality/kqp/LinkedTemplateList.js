import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { Button, Table } from 'antd';
import { useIntl } from "react-intl";
import SearchBox from '../../../../components/SearchBox'; 

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
    const [filteredTemplateList, setFilteredTemplateList] = useState([]);

    useEffect(() => {
        console.log("init")
        // setTemplateList([]);
        // setSearchValue([]);
        // setPageNo([]);
    }, []);

    useEffect(() => {
        console.log("data load")
        props.fetchKqpLinkList(1, 15, searchValue);
    }, []);
    useEffect(() => {
        if (!props.template.loading && !props.template.error && props.template.operation === 'kqpLinkList') {
            const jsonData = props.template.data;
            const groupedData = {};
            jsonData.forEach((item) => {
                const { kqpId, kqpName, stageName, partyName } = item;
    
                const key = `${kqpId}-${kqpName}-${stageName}`;
    
                if (!groupedData[key]) {
                    // If the group doesn't exist yet, create it
                    groupedData[key] = {
                        kqpId,
                        kqpName,
                        stageName,
                        parties: [],
                    };
                }
                // Add the partyName to the parties array in the group
                groupedData[key].parties.push(partyName);
            });
            const groupedArray = Object.values(groupedData);
            console.log(groupedArray);
    
            // Update the totalPageItems state
            setTotalItems(groupedArray.length);
            setTemplateList(groupedArray);
            
            // Filter the data based on the searchValue
            if (searchValue && searchValue.length >= 2) {
                // Filter the templateList based on the searchValue
                const filteredList = groupedArray.filter(item => {
                    if(item.kqpId?.toString() === searchValue ||
                    item.kqpName?.toLowerCase().includes(searchValue.toLowerCase()) )  {
                    return item;
                }
            });
                setFilteredTemplateList(filteredList);
                setPageNo(1);
            } else {
                
                setFilteredTemplateList(groupedArray);
            }
        }
    }, [props.template.loading, props.template.error, props.template.operation]);

    // useEffect(() => {
    //     if (searchValue) {
    //         if (searchValue.length >= 3) {
    //             setPageNo(1);
    //             // props.fetchKqpLinkList(1, 20, searchValue, customerValue);
    //             props.fetchKqpLinkList(1, 20, searchValue);
    //         }
    //     } else {
    //         setPageNo(1);
    //            props.fetchKqpLinkList(1, 20);
    //     }
    // }, [searchValue]);
    const handleSearch = (value, page) => {
        setSearchValue(value);
        setPageNo(1); 
        props.fetchKqpLinkList(page, 15, searchValue); 
    };

    const handleChange = (pagination, filters, sorter, extra) => {
        setPageNo(pagination.current);
        props.fetchKqpLinkList(pagination.current, 15, searchValue);
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
                        onChange={(e) => handleSearch(e.target.value)}>
                    </SearchBox>}

                </div>
                <div className="gx-w-50">
                    {actions.export && <Button
                        size="default"
                        className="gx-float-right"
                    >
                        {intl.formatMessage({ id: actions.export.label })}
                    </Button>}
                    {actions.print && <Button
                        size="default"
                        className="gx-float-right"
                    >
                        {intl.formatMessage({ id: actions.print.label })}
                    </Button>}
                </div>
            </div>
            <Table
                className="gx-table-responsive"
                columns={props.columns}
                dataSource={filteredTemplateList}
                onChange={handleChange}
                rowSelection={rowSelection}
                pagination={{
                    pageSize: 15,
                    onChange: (page) => {
                        setPageNo(page);
                        props.fetchKqpLinkList(page, 15, searchValue);
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