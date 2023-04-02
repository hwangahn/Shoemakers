import { Affix, Avatar, Badge, Button, Card, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import NavBar from "./navBar";
const ButtonGroup = Button.Group;

function ShoeCard({ props, shoeList, setShoeList }) {
    let { iid, sid, name, imageURL, gender, price, qty, size } = props;
    let [disabled, setDisabled] = useState(false);
    let navigate = useNavigate();

    function update(iid, qty) {
        return fetch('/api/cart/update', {
            method: 'post',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                iid: iid,
                qty: qty
            })
        })
        .then((res) => { return res.json() });
    }

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
                    style={{float: "left", width: "450px"}}
                    onClick={() => {
                        navigate(`/shoe/${sid}`);
                    }}
                />
                <div style={{float: "right"}}>
                    <p>{`${price.toLocaleString('en-US')}₫`}</p>
                    <p>Size: {size}</p>
                    <h3>
                        Quantity:&nbsp;
                        <Badge count={qty} />
                    </h3>
                    <ButtonGroup >
                        <Button disabled={disabled} onClick={() => {
                            setDisabled(true);
                            let newShoeList =shoeList.map((element) => { return element });

                            newShoeList.forEach(element => {
                                if (element.iid == iid && element.qty > 1) {
                                    update(iid, -1).then(((data) => {
                                        if (data.msg == "OK") {
                                            message.success("Done");
                                            element.qty -= 1;
                                        } else {
                                            message.error(data.msg);
                                        }
                                        setDisabled(false);
                                        setShoeList(newShoeList);
                                    }))
                                } else if (element.iid == iid && element.qty <= 1) {
                                    setDisabled(false);
                                    message.warning("Minimum 1 item");
                                }
                            });
                            
                        }} icon={<MinusOutlined />} />
                        <Button disabled={disabled} onClick={() => {
                            setDisabled(true);
                            let newShoeList = shoeList.map((element) => { return element });

                            newShoeList.forEach(element => {
                                if (element.iid == iid) {
                                    update(iid, 1).then(((data) => {
                                        if (data.msg == "OK") {
                                            message.success("Done");
                                            element.qty += 1;
                                        } else {
                                            message.error(data.msg);
                                        }
                                        setDisabled(false);
                                        setShoeList(newShoeList);
                                    }))
                                }
                            });
                        }} icon={<PlusOutlined />} />

                    </ButtonGroup>
                    <Button disabled={disabled} onClick={() => {}} type="primary">
                        Remove 
                    </Button>
                </div>
            </Card>
        </div>
    )
}

function ShoeRack({ shoeList, setShoeList }) {

    return (
        <div style={{width: "50%", float: "left"}}>
            <div className='shoe-rack' style={{
                display: "flex",
                flexDirection: "column",
                flexDrap: "wrap"
            }}>
                {shoeList.map(element => {
                    return (
                        <ShoeCard 
                            props={element}
                            shoeList={shoeList}
                            setShoeList={setShoeList}
                        />
                    )
                })}
            </div>
        </div>
    );
}

function Details({ total }) {
    return (
        <Affix offsetTop={50}>
            <div style={{width: "50%", float: "right"}}>
                <Card style={{
                    width: 150,
                    margin: "20px",
                    borderRadius: "20px",
                    overflow: "hidden",
                }}>
                    <h2>Total:</h2>
                    <p>{`${total.toLocaleString('en-US')}₫`}</p>
                    <br />
                    <Button type="primary">Checkout</Button>
                </Card>
            </div>
        </Affix>
    )
}

export default function Cart() {
    let [credential, setCredential] = useState();
    let [shoeList, setShoeList] = useState();
    let [total, setTotal] = useState(0);

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
        .then((data) => { setShoeList(data.shoes.map((element) => { return element })) });
    }, []);

    useEffect(() => {

        if (shoeList) {

            let refTotal = 0;

            shoeList.forEach((element) => {
                refTotal += element.price * element.qty;
            });

            setTotal(refTotal);
        }
    }, [shoeList])

    if (credential && shoeList) {
        return (
            <div>
                <NavBar props={credential}/>
                <ShoeRack 
                    shoeList={shoeList} 
                    setShoeList={setShoeList}
                />
                <Details total={total} />
            </div>
        )
    }
}