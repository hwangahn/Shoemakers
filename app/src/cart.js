import { Button, Card, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import NavBar from "./navBar";
const ButtonGroup = Button.Group;

function ShoeCard({ iid, sid, name, imageURL, gender, price, qty, size }) {
    return (
        <div>
            <Card
                key={sid}
                className='shoe-card'
                hoverable
                style={{
                    width: 600,
                    height: 200,
                    margin: "20px",
                    borderRadius: "20px",
                    overflow: "hidden",
                }}
                cover={
                    <Link to={{pathname: `/shoe/${sid}`}}>
                        <img alt="example" src={imageURL} height='200' width='200' />
                    </Link>
                }
            >
                <Card.Meta title={name} description={gender} />
                <p>{`${price.toLocaleString('en-US')}₫`}</p><br/>
                <h3>Quantity:</h3><br/>
                <p>{qty}</p>
                <ButtonGroup>
                    <Button onClick={() => {}} icon={<MinusOutlined />} />
                    <Button onClick={() => {}} icon={<PlusOutlined />} />
                </ButtonGroup>
            </Card>
        </div>
    )
}

function ShoeRack({ props }) {

    console.log(props);
    let shoesInPage = props.shoes;

    return (
        <div style={{width: "50%", float: "left"}}>
            <div className='shoe-rack' style={{
                display: "flex",
                flexDirection: "column",
                flexDrap: "wrap"
            }}>
                {shoesInPage.map(element => {
                    return (
                        <ShoeCard 
                            iid={element.iid}
                            sid={element.sid} 
                            name={element.name} 
                            gender={element.gender} 
                            price={element.price} 
                            imageURL={element.imageURL}
                            qty={element.qty}
                            size={element.size}
                        />
                    )
                })}
            </div>
        </div>
    );
}

function Details() {
    return (
        <div style={{width: "50%", float: "right"}}>
            <div>
                <h2>Total:</h2>
                <br />
            </div>
            <Button>Checkout</Button>
        </div>
    )
}

export default function Cart() {
    let [credential, setCredential] = useState();
    let [shoes, setShoes] = useState();

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
        .then((data) => { setShoes(data) });
    }, []);

    if (credential && shoes) {
        console.log(shoes);
        return (
            <div>
                <NavBar props={credential}/>
                <ShoeRack props={shoes} />
                <Details />
            </div>
        )
    }
}