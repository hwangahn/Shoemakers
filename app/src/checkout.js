import { Button, Result, Select, Space, message } from "antd";
import { useEffect, useState } from "react";

function OrderForm() {

    let [city, setCity] = useState();
    let [district, setDistrict] = useState();
    let [ward, setWard] = useState();
    let [cityList, setCityList] = useState(null);
    let [districtList, setDistrictList] = useState(null);
    let [wardList, setWardList] = useState(null);
    let [paymentMethod, setPaymentMethod] = useState("");
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
        .then((data) => { setCityList(data.data) })
    }, [])

    let getDistrictList = (value) => {
        setExpectedArrival("");
        setCity(value);
        setDistrict();
        setWard();
        setWardList(null);
        setDistrictList(null);
        fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'token': process.env.REACT_APP_GHN_API_KEY
            },
            body: JSON.stringify({
                Province_ID: value
            })
        })
        .then((res) => { return res.json(); })
        .then((data) => { setDistrictList(data.data) })
    }

    let getWardList = (value) => {
        setExpectedArrival("");
        setDistrict(value);
        setWard();
        setWardList(null);
        fetch('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'token': process.env.REACT_APP_GHN_API_KEY
            },
            body: JSON.stringify({
                District_ID: value
            })
        })
        .then((res) => { return res.json(); })
        .then((data) => { setWardList(data.data) })
    }

    let getExpArr = (value) => {
        setWard(value);
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
            let date = new Date((data.data.leadtime * 1000) + (1000 * 60 * 60)).toDateString();
            setExpectedArrival(`Expected arrival: ${date}`); 
        });
    }

    let checkout = () => {
        if (ward && district && city && paymentMethod) {

        } else {
            message.warning("Please fill in all information");
        }
    }

    return (
        <div style={{ padding: "200px", width: "60%", float: "left" }}>
            <Space direction="vertical">
                <Space size={10} style={{ width: "100%" }}>
                    {cityList &&
                    <Select placeholder="Select city" style={{width: "200px"}} onChange={getDistrictList}>
                        { cityList.map((element, index) => { return <Select.Option value={element.ProvinceID} key={index}>{element.ProvinceName}</Select.Option> }) }
                    </Select>
                    }
                    {districtList && 
                    <Select placeholder="Select district" style={{width: "200px"}} onChange={getWardList}>
                        { districtList.map((element, index) => { return <Select.Option value={element.DistrictID} key={index}>{element.DistrictName}</Select.Option> }) }
                    </Select>
                    }
                    {wardList && 
                    <Select placeholder="Select ward" style={{width: "200px"}} onChange={getExpArr}>
                        { wardList.map((element, index) => { return <Select.Option value={element.WardCode} key={index}>{element.WardName}</Select.Option> }) }
                    </Select>
                    }
                </Space>
                <p>{expectedArrival}</p>
                <Select placeholder="Payment method" style={{ width: "620px" }} onChange={(value) => setPaymentMethod(value)}>
                    <Select.Option value={"cod"}>Cash On Delivery</Select.Option>
                    <Select.Option value={"credit"}>Credit Card</Select.Option>
                </Select>
                <Button type="primary" style={{ marginLeft: "auto" }} onClick={checkout}>Checkout</Button>
            </Space>
        </div>
    )

}

export default function Checkout() {
    return (
        <OrderForm />
    )
}