import React, { useEffect, useRef, useState } from 'react'
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Select, Table } from 'antd'
import {
    fetchPartyList,
    fetchInwardList,
    fetchQualityReportList,
    getQualityReportById,
    fetchQualityReportStageList,
    labelPrintInward
} from "../../../appRedux/actions";
import moment from "moment";
import { useIntl } from "react-intl";
import SearchBox from "../../../components/SearchBox";

const LabelPrintInward = (props) => {

    const [sortedInfo, setSortedInfo] = useState({
        order: "descend",
        columnKey: "age",
    });
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [filteredInwardList, setFilteredInwardList] = useState([]);
    const [qualityReportList, setQualityReportList] = useState([]);

    const [pageNo, setPageNo] = React.useState(1);
    const [totalPageItems, setTotalItems] = React.useState(0);
    const [partyList, setPartyList] = useState([]);
    const [templateId, setTemplateId] = useState();
    const { totalItems } = props.inward;
   
    const columns = [
        {
            title: "Coil Number",
            dataIndex: "coilNo",
            key: "coilNo",
            filters: [],
            sorter: (a, b) => a.coilNo.length - b.coilNo.length,
            sortOrder: sortedInfo.columnKey === "coilNo" && sortedInfo.order,
        },
        {
            title: "Batch Number",
            dataIndex: "customerBatchNo",
            key: "customerBatchNo",
            filteredValue: filteredInfo ? filteredInfo["customerBatchNo"] : null,
            onFilter: (value, record) => record.customerBatchNo == value,
            filters: [],
            sorter: (a, b) => a.customerBatchNo.length - b.customerBatchNo.length,
            sortOrder: sortedInfo.columnKey === "customerBatchNo" && sortedInfo.order,
        },
        {
            title: "Inward Date",
            dataIndex: "planDate",
            render(value) {
               const formattedDate = moment(value, "DD/MM/YYYY").format("Do MMM YYYY");
                return <span>{formattedDate}</span>;
            },
            key: "planDate",
            filters: [],
            sorter: (a, b) => moment(a.planDate, "DD/MM/YYYY").valueOf() - moment(b.planDate, "DD/MM/YYYY").valueOf(),
            sortOrder: sortedInfo.columnKey === "planDate" && sortedInfo.order,
        },
        {
            title: "Material",
            dataIndex: "materialDesc",
            key: "materialDesc",
            filteredValue: filteredInfo ? filteredInfo["materialDesc"] : null,
            onFilter: (value, record) => record.materialDesc == value,
            filters: [],
            sorter: (a, b) =>
                a.materialDesc.length - b.materialDesc.length,
            sortOrder:
                sortedInfo.columnKey === "materialDesc" && sortedInfo.order,
        },
        {
            title: "Grade",
            dataIndex: "materialGrade",
            key: "materialGrade",
            filteredValue: filteredInfo ? filteredInfo["materialGrade"] : null,
            onFilter: (value, record) => record.materialGrade == value,
            filters: [],
            sorter: (a, b) =>
                a.materialGrade.length - b.materialGrade.length,
            sortOrder:
                sortedInfo.columnKey === "materialGrade" && sortedInfo.order,
        },
        {
            title: "Thickness",
            dataIndex: "fthickness",
            key: "fthickness",
            filters: [],
            sorter: (a, b) => a.fthickness - b.fthickness,
            sortOrder: sortedInfo.columnKey === "fthickness" && sortedInfo.order,
        },
        {
            title: "Width",
            dataIndex: "fwidth",
            key: "fwidth",
            filters: [],
            sorter: (a, b) => a.fwidth - b.fwidth,
            sortOrder: sortedInfo.columnKey === "fwidth" && sortedInfo.order,
        },
        {
            title: "Weight",
            dataIndex: "targetWeight",
            key: "targetWeight",
            filters: [],
            sorter: (a, b) => a.targetWeight - b.targetWeight,
            sortOrder: sortedInfo.columnKey === "targetWeight" && sortedInfo.order,
        },
        {
            title: "Action",
            dataIndex: "",
            key: "x",
            render: (text, record, index) => (
                <span>
                     <span
                        className="gx-link"
                        onClick={() => onPdf(record.inwardEntryId)}
                    >
                       Label Print
                    </span>
                </span>
            ),
        },
    ];

    useEffect(() => {
        props.fetchQualityReportStageList({ stage: "inward", page: 1, pageSize: 15, partyId: '' });
        props.fetchQualityReportList();
        props.fetchPartyList();
    }, []);

    useEffect(() => {
        const { template } = props;
        if(searchValue) {
            const filteredData = filteredInwardList.filter(item => 
            (item.coilNo.toLowerCase().includes(searchValue.toLowerCase())) ||
            (item.customerBatchNo.toLowerCase().includes(searchValue.toLowerCase())));

            setFilteredInwardList(filteredData);
        } else {
            setFilteredInwardList(template.data);
        }  
           
    }, [searchValue]);


    const isInitialMount = useRef(true);
    useEffect(() => {
        if (!isInitialMount.current){
        if (!props.template.loading && !props.template.error && props.template.operation == "fetchQualityReport") {
            console.log(props.template)
            setQualityReportList(props.template.data)
        } else if (!props.template.loading && !props.template.error && props.template.operation == "fetchQualityReportStage") {
            console.log(props.template)
            setFilteredInwardList(props.template.data)
            console.log(props.template.data)
        }}
        else {
            // This block will be executed only on the first render
            isInitialMount.current = false;
        }
    }, [props.template.loading, props.template.error, props.template.operation]);

    const handleChange = (e) => {
        console.log(e)
        setTemplateId(e)
    };

    useEffect(() => {
        if (!props.party.loading && !props.party.error) {
            console.log(props.party)
            setPartyList(props.party.partyList)
        }
    }, [props.party.loading, props.party.error]);

      const onPdf = (inwardEntryId) => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();
        setFilteredInwardList(prevList => {
            return prevList.map(item => {
                if (item.inwardEntryId === inwardEntryId) {
                    return { ...item, generatingDate: formattedDate };
                }
                return item;
            });
        });

        const payloadpdf = {inwardEntryId:inwardEntryId, process:"INWARD"}
         props.labelPrintInward(payloadpdf);
    }

    return (
        <>

            <div className="gx-flex-row gx-flex-1">
                <div className="table-operations gx-col">
                    <Select
                        id="select"
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a customer"
                        optionFilterProp="children"
                        onChange={handleChange}
                        value={templateId}
                        // onFocus={handleFocus}
                        // onBlur={handleBlur}
                        filterOption={(input, option) =>
                            option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                    >

                        {partyList.length > 0 &&
                            partyList.map((party) => (
                                <Select.Option key={party.nPartyId} value={party.nPartyId}>{party.partyName}</Select.Option>
                            ))}
                    </Select>
                </div>
                <div className="table-operations gx-col">
                    <SearchBox
                        styleName="gx-flex-1"
                        placeholder="Search by Coil no. or Customer batch no"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}>
                    </SearchBox>

                </div>
            </div>
            {/* <div className="gx-flex-row gx-flex-1"> */}
            <div>
                {(filteredInwardList.length > 0) && <Table
                    className="gx-table-responsive"
                    columns={columns}
                     dataSource={filteredInwardList}
                    pagination={{
                        pageSize: 15,
                        onChange: (page) => {
                            setPageNo(page);
                            props.fetchQualityReportStageList(page, 15, searchValue);
                        },
                        current: pageNo,
                        total: totalPageItems,
                    }}
                />}
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    template: state.quality,
    inward: state.inward,
    party: state.party,
});

export default connect(mapStateToProps, {
    fetchInwardList,
    fetchPartyList,
    fetchQualityReportList,
    getQualityReportById,
    fetchQualityReportStageList,
    labelPrintInward
})(withRouter(LabelPrintInward));