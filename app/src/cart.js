import { Affix, Avatar, Badge, Button, Card, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MinusOutlined, PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import NavBar from "./navBar";

function ShoeCard({ props, shoeList, setShoeList, buttonDisabled, setButtonDisabled }) {
    let { iid, sid, name, imageURL, gender, price, qty, size } = props;
    let navigate = useNavigate();

    let update = (iid, qty) => {
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

    let handleMinus = () => {
        setButtonDisabled(true);
        let newShoeList =shoeList.map((element) => { return element });
        let alteredElement = newShoeList.find((element) => { return element.iid == iid && element.qty > 1 });
        if (!alteredElement) {
            setButtonDisabled(false);
            message.warning("Minimum 1 item");
        } else {
            update(iid, -1).then((data) => {
                if (data.msg == "OK") {
                    message.success("Done");
                    alteredElement.qty -= 1;
                } else {
                    message.warning(data.msg);
                }
                setButtonDisabled(false);
                setShoeList(newShoeList);
            });
        }
    }

    let handlePlus = () => {
        setButtonDisabled(true);
        let newShoeList = shoeList.map((element) => { return element });
        let alteredElement = newShoeList.find((element) => { return element.iid == iid });
        update(iid, 1).then((data) => {
            if (data.msg == "OK") {
                message.success("Done");
                alteredElement.qty += 1;
            } else {
                message.warning(data.msg);
            }
            setButtonDisabled(false);
            setShoeList(newShoeList);
        });
    }

    let handleRemove = () => {
        setButtonDisabled(true);
        let newShoeList = shoeList.filter((element) => {
            if (element.iid != iid) { 
                return element; 
            }
        });
        fetch('/api/cart/delete', {
            method: 'post',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                iid: iid
            })
        })
        .then(() => {
            message.success("Done");
            setButtonDisabled(false);
            setShoeList(newShoeList);
        });
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
                    onClick={() => { navigate(`/shoe/${sid}`); }}
                />
                <div style={{float: "right"}}>
                    <p>{`${price.toLocaleString('en-US')}₫`}</p>
                    <p>Size: {size}</p>
                    <h3>
                        Quantity:&nbsp;
                        <Badge color="blue" count={qty} />
                    </h3>
                    <Button.Group>
                        <Button disabled={buttonDisabled} onClick={handleMinus} icon={<MinusOutlined />} />
                        <Button disabled={buttonDisabled} onClick={handlePlus} icon={<PlusOutlined />} />
                    </Button.Group>
                    <Button disabled={buttonDisabled} type="primary" onClick={handleRemove} ><DeleteOutlined /></Button>
                </div>
            </Card>
        </div>
    )
}

function ShoeRack({ shoeList, setShoeList, buttonDisabled, setButtonDisabled }) {

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
                            buttonDisabled={buttonDisabled}
                            setButtonDisabled={setButtonDisabled}
                        />
                    )
                })}
            </div>
        </div>
    );
}

function Details({ total, buttonDisabled }) {

    let navigate = useNavigate();

    return (
        <Affix offsetTop={50}>
            <div style={{width: "50%", float: "right"}}>
                <Card style={{
                    width: 165,
                    margin: "20px",
                    borderRadius: "20px",
                    overflow: "hidden",
                }}>
                    <h2>Total:</h2>
                    <p>{`${total.toLocaleString('en-US')}₫`}</p>
                    <br />
                    <Button type="primary" disabled={buttonDisabled} onClick={() => {navigate('/checkout')}} >
                        <CheckOutlined /> Checkout
                    </Button>
                </Card>
            </div>
        </Affix>
    )
}

export default function Cart() {
    let [credential, setCredential] = useState();
    let [shoeList, setShoeList] = useState();
    let [total, setTotal] = useState(0);
    let [buttonDisabled, setButtonDisabled] = useState(false);

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

    if (credential && shoeList) {
        return (
            <div>
                <NavBar props={credential}/>
                <ShoeRack 
                    shoeList={shoeList} 
                    setShoeList={setShoeList}
                    buttonDisabled={buttonDisabled}
                    setButtonDisabled={setButtonDisabled}
                />
                <Details 
                    total={total} 
                    buttonDisabled={buttonDisabled}
                />
            </div>
        )
    } else {
        return (
            <Spin />
        )
    }
}