import { Button, Select, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from './navBar';

function ShoeImage({ imageURL }) {
    return (
        <div>
            <img alt='shoeImage' src={imageURL} width="500px" height="500px" />
        </div>
    )
}

function OrderForm({ size }) {

    let sizes = [];

    size.forEach(element => {
        sizes.push(<option key={element} value={element}>{element}</option>);
    });


    return (
        <div>
            <Select style={{width: 75}} placeholder="Size" onChange={(e) => {}}>
                {sizes}
            </Select><br/>
            <Button class="addToCart">Add to cart</Button>
        </div>
    )
}

function Info({ name, gender, price }) {
    return (
        <div>
            <h2>{name}</h2>
            <h3>{gender}</h3>
            <h4>{price}</h4>
        </div>
    )
}

function Shoe({ name, gender, price, size, imageURL }) {
    return (
        <div>
            <div style={{width: "50%", float: "right"}}>
                <Info 
                    name={name} 
                    gender={gender}
                    price={price}
                />
                <OrderForm size={size} />
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
        fetch('http://localhost:4000/api/auth', {
            method: "post",
            credentials: 'include'
        })
        .then(res => { return res.json() })
        .then(data => { setCredential(data) });

        fetch(`http://localhost:4000/api/shoe/${param.sid}`)
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