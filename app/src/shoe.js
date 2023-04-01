import { Button, Select, Spin, message } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from './navBar';

function ShoeImage({ imageURL }) {
    return (
        <div>
            <img alt='shoeImage' src={imageURL} width="500px" height="500px" />
        </div>
    )
}

function OrderForm({ size, isLoggedIn }) {

    let [sizePick, setSizePick] = useState('-1');
    
    let sizes = size;
    let param = useParams();
    let navigate = useNavigate();
    
    return (
        <div>
            <Select style={{width: 75}} placeholder="Size" onChange={(value) => {
                setSizePick(value);
            }}>
                {sizes.map(element => <option value={element}>{element}</option>)}
            </Select>
            <Button class="addToCart" onClick={() => {
                if (!isLoggedIn) {
                    message.error("Please log in", 3)
                    navigate('/login');
                } else if (sizePick == "-1") {
                    message.warning("Please pick your size", 3);
                } else {
                    fetch('/api/cart/add', {
                        method: 'post',
                        credentials: 'include',
                        headers: {
                            "Content-Type": "application/json" 
                        },
                        body: JSON.stringify({
                            sid: param.sid,
                            size: sizePick
                        })
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.msg === "OK") {
                            message.success("Added to cart");
                        } else {
                            message.error(data.msg);
                        }
                    })
                }
            }}>Add to cart</Button>
        </div>
    )
}

function Info({ name, gender, price }) {
    return (
        <div>
            <h2>{name}</h2>
            <h3>{gender}</h3>
            <h4>{`${price.toLocaleString('en-US')}₫`}</h4>
        </div>
    )
}

function Shoe({ name, gender, price, size, imageURL, credential }) {

    return (
        <div>
            <div style={{width: "50%", float: "right"}}>
                <Info 
                    name={name} 
                    gender={gender}
                    price={price}
                />
                <OrderForm size={size} isLoggedIn={credential.isLoggedIn} />
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
        .then(data => { 
            setShoeDetail(data); 
        });
    }, [param]);

    if (credential && shoeDetail) {
        return (
            <div>
                <NavBar props={credential} />
                <Shoe 
                    name={shoeDetail.shoe.name}
                    gender={shoeDetail.shoe.gender}
                    price={shoeDetail.shoe.price}
                    size={shoeDetail.size}
                    imageURL={shoeDetail.shoe.imageURL}
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
// jsx