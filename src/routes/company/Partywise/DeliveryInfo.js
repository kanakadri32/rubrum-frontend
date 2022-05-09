import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Popover,Input, Card, message } from "antd";
import { InfoCircleOutlined, CloseSquareTwoTone } from "@ant-design/icons";
import { postDeliveryConfirm, generateDCPdf,resetInstruction,saveUnprocessedDelivery } from "../../../appRedux/actions";
import moment from "moment";

const DeliveryInfo = (props) => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [remarksList, setRemarksList] = useState([]);
  const [instructionList, setInstructionList]= useState([]);
  useEffect(()=>{
    let insList = props.inward.inwardListForDelivery?.map(i => {
      return i.instruction || i;
    });
    insList = insList?.flat();
    setInstructionList(insList?.map(item => item.instructionId));
  },[]);
  useEffect(()=>{
    if(props.inward.deliverySuccess){
      const pdfPayload ={
        instructionIds: instructionList
      }
      props.generateDCPdf(pdfPayload);
    }

  },[props.inward.deliverySuccess])
  useEffect(()=>{
    if(props.inward.dcpdfSuccess) {
        message.success('Delivery Challan pdf generated successfully', 2).then(() => { 
          props.resetInstruction();
          props.history.push('/company/partywise-register');
         
});
}
},[props.inward.dcpdfSuccess])
useEffect(()=>{
  if(props.inward?.unprocessedSuccess){
    let arrayList=[];
    arrayList.push(props.inward?.unprocessedSuccess?.instructionId)
    const pdfPayload ={
      instructionIds: arrayList
    }
    props.generateDCPdf(pdfPayload);
  }
},[props.inward.unprocessedSuccess])
  const handleRemark = (elem, id) => {
    let index = remarksList.findIndex(elem => elem.id === id)
    let newRemarksList = remarksList
    newRemarksList[index] = { instructionId: id, remark: elem.target.value }
    setRemarksList(newRemarksList)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let inslist = props?.inward.inwardListForDelivery.map(item => {
      if(item?.inwardEntryId){
        const payload ={
          inwardEntryId: item?.inwardEntryId,
          motherCoilDispatch: true
        }
        props.saveUnprocessedDelivery(payload)
      }else {
        const reqObj = {
          vehicleNo,
          inwardListForDelivery: props.inward.inwardListForDelivery
        }
       
        props.postDeliveryConfirm(reqObj);
      }
    })
   
   
  };

 
  return (
    <div>
      <h1>Delivery Information</h1>
      <Card>
        {props.inward.inwardList.length > 0 ? (
          props.inward.inwardListForDelivery.map((elem) => (elem?.instructionId || elem?.status?.statusName ==="RECEIVED") && (
            <div key={elem?.instructionId || elem?.inwardEntryId}
              style={{
                border: "1px solid black",
                display: "flex",
                padding: "5px 10px",
                margin: "10px 0px",
              }}

            >
              <div style={{ padding: "10px" }}>
                <image
                  src={require("assets/images/inward/cutting_icon.svg")}
                  title="main coil image"
                  style={{ marginTop: "10px" }}
                />
              </div>
              <div className="flex flex-col">
                <div style={{ marginTop: "5px" }}>
                  <p style={{ fontWeight: "bold" }}>Coil Number - {elem.instructionId || elem?.inwardEntryId}</p>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <p style={{ marginTop: "10px" }}>
                      Coil Width:{elem?.plannedWidth || elem?.fWidth}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Thickness:{elem?.fThickness}
                    </p>
                  </div>
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Weight:{elem?.plannedWeight || elem?.fpresent}
                    </p>
                  </div>
                 {elem?.instructionDate && <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Sliting/Cutting Date:{moment(elem.instructionDate).format('DD/MM/YYYY')}
                    </p>
                  </div>}
                  <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Coil Length:{elem?.plannedLength || elem?.fLength}
                    </p>
                  </div>
                  {elem?.rateId &&<div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Rate -{elem?.rateId}
                    </p>
                  </div>}
                  {elem?.packetClassification && <div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      Tags -{elem?.packetClassification?.classificationName}
                    </p>
                  </div>}
                 { elem?.endUserTagsentity &&<div>
                    <p style={{ marginLeft: "5px", marginTop: "10px" }}>
                      End User Tags -{elem?.endUserTagsentity?.tagName}
                    </p>
                  </div>}
                  <div style={{ marginLeft: "3px", marginTop: "10px" }}>
                    <Popover
                      content={
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <p>Thickness: {elem.actualWeight && elem.rates && elem.rates?.thicknessRate ?
                            elem.actualWeight * elem.rates?.thicknessRate : 0}</p>
                          <p>Process: {elem.process?.processName}</p>
                          <p>Material: {elem.rates?.materialType?.description}</p>
                        </div>
                      }
                      title="Rate"
                    >
                      <InfoCircleOutlined />
                    </Popover>
                  </div>
                  
                  <div style={{ marginLeft: "20px" }}>
                    <Input
                      placeholder="Remarks"
                      type="text"
                      defaultValue={elem.remarks}
                      onChange={(event) => { elem.remarks = event.target.value; }}
                    />
                  </div>
                  <div style={{ marginLeft: "20px" }}>
                    <CloseSquareTwoTone style={{ width: "20px" }} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div> Nothing selected for delivery</div>
        )}
      </Card>
      {props.inward.inwardList.length > 0 ? (
        <div>
          <div style={{ width: "20%", marginBottom: "15px" }}>
            <Input
              placeholder="Vehicle Number"
              type="text"
              onChange={(e) => setVehicleNo(e.target.value)}
            />
          </div>
          <div>
            {vehicleNo.length < 1 ?
              < button
                type="secondary"
                style={{
                  marginBottom: "10px",
                  padding: "6px 15px",
                  marginRight: "20px",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }}>Confirm</button>
              : <button
                type="primary"
                style={{
                  marginBottom: "10px",
                  padding: "6px 15px",
                  marginRight: "20px",
                  backgroundColor: "#26eb5d",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }} onClick={handleSubmit} >Confirm & Generate</button>
            }
            <button
              style={{ marginBottom: "10px", padding: "6px 15px" }}
              onClick={() => {
                props.history.push("/company/partywise-register");
              }}
            >Go Back
            </button>
          </div>
        </div>
      ) : (
        <button
          style={{ marginBottom: "10px", padding: "6px 15px" }}
          onClick={() => {
            props.history.push("/company/partywise-register");
          }}
        >
          Go Back
        </button>
      )
      }
    </div >
  );
};

const mapStateToProps = (state) => ({
  inward: state.inward,
});

export default connect(mapStateToProps, { saveUnprocessedDelivery,postDeliveryConfirm, generateDCPdf,resetInstruction})(DeliveryInfo);
