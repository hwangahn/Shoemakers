import { Button, Result, Select, Space, Spin, Card, Avatar, Badge, Affix, message, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from './navBar';

function OrderForm({ buttonDisabled, total, shoeList, setShoeList, setOrderNumber }) {

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
                to_ward_code: value,
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
            fetch('/api/checkout', {
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'post',
                credentials: 'include',
                body: JSON.stringify({
                    city: city,
                    district: district,
                    ward: ward,
                    paymentMethod: paymentMethod,
                    total: total
                })
            })
            .then((res) => { return res.json() })
            .then((data) => { 
                console.log(data);
                if (data.msg == 'OK') {
                    setOrderNumber(data.oid);
                } else {
                    setShoeList(data.shoes);
                    data.msg.forEach((element) => message.error(element));
                }
            })
        } else {
            message.warning("Please fill in all information");
        }
    }

    let filter = (input, option) => {
        let keyword = RegExp(`${input.toLowerCase()}`);
        return keyword.test(option.children.toLowerCase());
    }

    return (
        <Affix offsetTop={100}>
            <div style={{ paddingTop: "200px", paddingLeft: "100px", width: "40%", float: "left" }}>
                <Space direction="vertical" style={{ width: "100%" }} >
                    <h2>Billing information</h2>
                    <Space size={10} >
                        {cityList &&
                        <Select showSearch placeholder="Select city" style={{width: "200px"}} filterOption={filter} onChange={getDistrictList}>
                            { cityList.map((element, index) => { return <Select.Option value={element.ProvinceID} key={index}>{element.ProvinceName}</Select.Option> }) }
                        </Select>
                        }
                        {districtList && 
                        <Select showSearch placeholder="Select district" style={{width: "200px"}} filterOption={filter} onChange={getWardList}>
                            { districtList.map((element, index) => { return <Select.Option value={element.DistrictID} key={index}>{element.DistrictName}</Select.Option> }) }
                        </Select>
                        }
                        {wardList && 
                        <Select showSearch placeholder="Select ward" style={{width: "200px"}} filterOption={filter} onChange={getExpArr}>
                            { wardList.map((element, index) => { return <Select.Option value={element.WardCode} key={index}>{element.WardName}</Select.Option> }) }
                        </Select>
                        }
                    </Space>
                    <p style={{ paddingLeft: '20px' }} >{expectedArrival}</p>
                    <Select placeholder="Payment method" style={{ width: "620px", paddingBottom: "10px" }} onChange={(value) => setPaymentMethod(value)}>
                        <Select.Option value={"cod"}>Cash On Delivery</Select.Option>
                        <Select.Option value={"credit"}>Credit Card</Select.Option>
                    </Select>
                    <Button type="primary" disabled={buttonDisabled} onClick={checkout} >Checkout</Button>
                </Space>
            </div>
        </Affix>
    )

}

function ShoeCard({ props }) {
    let { sid, name, imageURL, gender, price, qty, size } = props;
    let navigate = useNavigate();

    return (
        <div>
            <Card
                key={sid}
                className='shoe-card'
                hoverable
                style={{
                    width: 700,
                    height: 250,
                    margin: "20px",
                    borderRadius: "20px",
                    overflow: "hidden",
                }}
            >
                <Card.Meta 
                    title={name} 
                    description={gender} 
                    avatar={<Avatar src={imageURL} shape="square" style={{height: '200px', width: '200px'}} />}
                    style={{ float: "left", width: "450px" }}
                    onClick={() => { navigate(`/shoe/${sid}`); }}
                />
                <div style={{ float: "right" }}>
                    <p>{`${price.toLocaleString('en-US')}₫`}</p>
                    <p>Size: {size}</p>
                    <h3>
                        Quantity:&nbsp;
                        <Badge color="blue" count={qty} />
                    </h3>
                </div>
            </Card>
        </div>
    )
}

function ShoeRack({ shoeList, total }) {

    return (
        <div style={{ width: "50%", paddingTop: "200px", float: "right" }}>
            <Space direction="vertical">
                <Space size={475} style={{paddingLeft: '50px'}}>
                    <h2>Total:</h2>
                    <p style={{ fontSize: "150%" }}>{`${total.toLocaleString('en-US')}₫`}</p>
                </Space>
                <Divider/>
                <div className='shoe-rack' style={{
                    display: "flex",
                    flexDirection: "column",
                    flexDrap: "wrap"
                }}>
                    {shoeList.map(element => {
                        return (
                            <ShoeCard 
                                props={element}
                            />
                        )
                    })}
                </div>
            </Space>
        </div>
    );
}

export default function Checkout() {

    let [credential, setCredential] = useState();
    let [shoeList, setShoeList] = useState();
    let [total, setTotal] = useState(0);
    let [buttonDisabled, setButtonDisabled] = useState(false);
    let [orderNumber, setOrderNumber] = useState('');

    let navigate = useNavigate();

    useEffect(() => {
        fetch('/api/auth', {
            method: "post",
            credentials: 'include'
        })
        .then(res => { return res.json() })
        .then(data => { 
            if (!data.isLoggedIn) {
                navigate('/login');
                message.error("Please log in");
            } else {
                setCredential(data);
            }
        });

        fetch('/api/cart', {
            method: 'get',
            credentials: "include"
        })
        .then((res) => { return res.json() })
        .then((data) => { 
            setShoeList(data.shoes.map((element) => { return element }));
            data.msg.map((msg) => message.warning(msg));
            setButtonDisabled(data.shoes.length == 0);
        });
    }, []);

    useEffect(() => {

        if (shoeList) {

            let refTotal = 0;

            shoeList.forEach((element) => {
                refTotal += element.price * element.qty;
            });

            setTotal(refTotal);
            setButtonDisabled(shoeList.length == 0);
        }
    }, [shoeList])

    if (credential && shoeList && orderNumber == '') {
        return (
            <div>
                <NavBar props={credential}/>
                <OrderForm 
                    buttonDisabled={buttonDisabled}
                    total={total}
                    shoeList={shoeList}
                    setShoeList={setShoeList}
                    setOrderNumber={setOrderNumber}
                />
                <ShoeRack 
                    shoeList={shoeList}
                    total={total}    
                />
            </div>
        )
    } else if (orderNumber != '') {
        return (
            <Result
                status="success"
                title="Your order has been accepted"
                subTitle={`Order number: ${orderNumber}. Head over to Orders for more details`}
                extra={[
                <Button type="primary" key="console" onClick={navigate('/')}>
                    Home
                </Button>
            ]}
            />
        )
    } else {
        return (
            <Spin />
        )
    }
}