import { Button, Card, Divider, Form, Select, Space, Spin, message } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons'
import NavBar from './navBar';
import TextArea from 'antd/es/input/TextArea';

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
            <Button className="addToCart" type='primary' disabled={disabled} onClick={handleAddToCart}>
                <ShoppingCartOutlined /> Add to cart
            </Button>
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
    let { username, review } = props;
    return (
        <div>
            <Card type='inner' title={username} style={{ width: "100%" }} >
                {review}
            </Card>
        </div>
    )
}

function ReviewForm({ credential, reviews, setReviews, sid }) {

    let [review, setReview] = useState("");
    let [formDisabled, setFormDiabled] = useState(false);

    let handleReview = (e) => {
        e.preventDefault();
        if (review !== "") {
            setFormDiabled(true);
            fetch(`/api/shoe/${sid}/review`, {
                method: 'post', 
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    review: review
                })
            })
            .then((res) => { return res.json(); })
            .then((data) => {
                if (data.msg != "OK") {
                    message.error(data.msg);
                } else {
                    let newReviews = reviews.map((element) => { return element; });
                    newReviews.push(data.review);
                    setReviews(newReviews);
                    message.success("Done");
                }
                setFormDiabled(false);
            });
        } else {
            message.warning("Write your review");
        }
    }

    return (
        <div style={{ width: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center' }} >
            <Space direction="vertical" size="middle" style={{ width: "50%", margin: "0 auto" }} >
                {credential.isLoggedIn &&
                <Form>
                    <Form.Item name="Review" >
                        <TextArea rows={4} placeholder='Your review' showCount maxLength={150} disabled={formDisabled} onChange={(e) => { setReview(e.target.value); }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' disabled={formDisabled} style={{ alignSelf: "right" }} onClick={handleReview} >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                }   
                {reviews.map((element) => { return <Review props={element} /> })}
            </Space>
        </div>
    )
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
    let [size, setSize] = useState();
    let [reviews, setReviews] = useState();

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
            setShoeDetail(data.shoe); 
            setReviews(data.review);
            setSize(data.size);
        });
    }, [param]);

    if (credential && shoeDetail) {
        return (
            <div>
                <div style={{height: "600px"}}>
                    <NavBar props={credential} />
                    <Shoe 
                        props={shoeDetail}
                        size={size}
                        credential={credential}
                    />
                </div>
                <Divider>Reviews</Divider>
                <div style={{width: "100%", display: 'flex', justifyContent: 'center'}}>
                    <ReviewForm 
                        credential={credential}
                        reviews={reviews} 
                        setReviews={setReviews}
                        sid={param.sid}
                    />
                </div>
                <br/>
            </div>
        )
    } else {
        return (
            <div>
                <Spin  />
            </div>
        )
    }
}
