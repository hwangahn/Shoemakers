import { Result, Select, Space } from "antd";
import { useEffect, useState } from "react";

function OrderForm() {

    let [city, setCity] = useState();
    let [district, setDistrict] = useState();
    let [ward, setWard] = useState();
    let [cities, setCities] = useState();
    let [districts, setDistricts] = useState();
    let [wards, setWards] = useState();
    let [paymentMethod, setPaymentMethod] = useState();
    let [expectedArrival, setExpectedArrival] = useState("");

    useEffect(() => {
        fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'token': process.env.REACT_APP_GHN_API_KEY
            }
        })
        .then((res) => { return res.json(); })
        .then((data) => { setCities(data.data); })
    }, [])

    useEffect(() => {
        setDistrict();
        setDistricts();
        setWard();
        setWards();
        setExpectedArrival("");
        fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'token': process.env.REACT_APP_GHN_API_KEY
            },
            body: JSON.stringify({
                Province_ID: city
            })
        })
        .then((res) => { return res.json(); })
        .then((data) => { setDistricts(data.data) })
    }, [city])

    useEffect(() => {
        setWard();
        setWards();
        setExpectedArrival("");
        fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'token': process.env.REACT_APP_GHN_API_KEY
            },
            body: JSON.stringify({
                District_ID: district
            })
        })
        .then((res) => { return res.json(); })
        .then((data) => { setWards(data.data) })
    }, [district])

    useEffect(() => {
        fetch('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'token': process.env.REACT_APP_GHN_API_KEY,
                'ShopID': process.env.REACT_APP_GHN_SHOPID
            },
            body: JSON.stringify({
                from_district_id: 1493,
                from_ward_code: "1A0710",
                to_district_id: district,
                to_ward_code: ward,
                service_id: 53320
            })
        })
        .then((res) => { return res.json(); })
        .then((data) => { 
            let date = new Date(data.data.leadtime * 1000).toDateString();
            setExpectedArrival(date); 
        });
    }, [ward && ward !== null])

    return (
        <div style={{ padding: "200px", width: "60%", float: "left" }}>
            <Space size={10} style={{ width: "100%" }}>
                {cities &&
                <Select placeholder="Select city" style={{width: "200px"}} onChange={(value) => {setCity(value)}}>
                    { cities.map((element, index) => { return <Select.Option value={element.ProvinceID} key={index}>{element.ProvinceName}</Select.Option> }) }
                </Select>
                }
                {districts && 
                <Select placeholder="Select district" style={{width: "200px"}} onChange={(value) => {setDistrict(value)}}>
                    { districts.map((element, index) => { return <Select.Option value={element.DistrictID} key={index}>{element.DistrictName}</Select.Option> }) }
                </Select>
                }
                {wards && 
                <Select placeholder="Select ward" style={{width: "200px"}} onChange={(value) => {setWard(value)}}>
                    { wards.map((element, index) => { return <Select.Option value={element.WardCode} key={index}>{element.WardName}</Select.Option> }) }
                </Select>
                }
            </Space>
            <Space style={{ width: "100%", paddingBottom: "10px", paddingLeft: "10px" }}>
                <p>Expected arrival: {expectedArrival}</p>
            </Space>
            <Select placeholder="Payment method" style={{ width: "620px" }} onChange={(value) => setPaymentMethod(value)}>
                <Select.Option value={"cod"}>Cash On Delivery</Select.Option>
                <Select.Option value={"credit"}>Credit Card</Select.Option>
            </Select>
        </div>
    )

}

export default function Checkout() {
    return (
        <OrderForm />
    )
}