import { Button, Card, Select, Spin, message } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from './navBar';

function ShoeImage({ imageURL }) {
    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <img alt='shoeImage' src={imageURL} width="500px" height="500px" />
        </div>
    )
}

function OrderForm({ size, isLoggedIn }) {

    let [sizePick, setSizePick] = useState('-1');
    let [disabled, setDisabled] = useState(false);
    
    let sizes = size;
    let navigate = useNavigate();

    let handleAddToCart = () => {
        setDisabled(true);
        if (!isLoggedIn) {
            message.error("Please log in");
            navigate('/login');
        } else if (sizePick == "-1") {
            message.warning("Please pick your size");
            setDisabled(false);
        } else {
            fetch('/api/cart/update', {
                method: 'post',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    iid: sizePick,
                    qty: 1
                })
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.msg === "OK") {
                    message.success("Added to cart");
                } else {
                    message.error(data.msg);
                }
                setDisabled(false);
            });
        }
    }
    
    return (
        <div>
            <Select style={{width: 150}} placeholder="Size" onChange={(value) => {
                setSizePick(value);
            }}>
                {sizes.map(element => <Select.Option value={element.iid}>{element.size}</Select.Option>)}
            </Select>
            <Button className="addToCart" type='primary' disabled={disabled} onClick={handleAddToCart}>Add to cart</Button>
        </div>
    )
}

function Info({ name, gender, price }) {
    return (
        <div>
            <h2>{name}</h2>
            <h3>{gender}</h3>
            <p>{`${price.toLocaleString('en-US')}₫`}</p>
        </div>
    )
}

function Review({ props }) {

}

function ReviewForm() {

}

function Shoe({ props, size, credential }) {

    let { name, gender, price, imageURL } = props;

    return (
        <div>
            <div style={{width: "50%", float: "right", justifyContent: "left"}}>
                <Card bordered={false} style={{width: "35%"}}>
                    <Info 
                        name={name} 
                        gender={gender}
                        price={price}
                    />
                    <OrderForm size={size} isLoggedIn={credential.isLoggedIn} />
                </Card>
            </div>
            <div style={{width: "50%", float: "left"}}>
                <ShoeImage imageURL={imageURL} />
            </div>
        </div>

    )
}

export default function ShoeView() {
    let [credential, setCredential] = useState();
    let [shoeDetail, setShoeDetail] = useState();

    let param = useParams();
    
    useEffect(() => {
        fetch('/api/auth', {
            method: "post",
            credentials: 'include'
        })
        .then(res => { return res.json() })
        .then(data => { setCredential(data) });

        fetch(`/api/shoe/${param.sid}`)
        .then(res => { return res.json() })
        .then(data => { setShoeDetail(data) });
    }, [param]);

    if (credential && shoeDetail) {
        return (
            <div>
                <NavBar props={credential} />
                <Shoe 
                    props={shoeDetail.shoe}
                    size={shoeDetail.size}
                    credential={credential}
                />
            </div>
        )
    } else {
        return (
            <div>
                <Spin />
            </div>
        )
    }
}
