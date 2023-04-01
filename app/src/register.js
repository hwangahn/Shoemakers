import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterView() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [passwordRetype, setPasswordRetype] = useState("");
    let [phone, setPhone] = useState("");
    let [address, setAddress] = useState("");
    let navigate = useNavigate();
    return ( 
        <div style={{width: "100%"}}>
            <Form style={{maxWidth: "300px", alignSelf: "center"}}>
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                >
                    <Input placeholder="Username" value={username} onChange={(e) => {
                        setUsername(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item
                    name="password"
                        rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                >
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => {
                        setPassword(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item
                    name="passwordRetype"
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                >
                    <Input type="password" placeholder="Retype password" value={passwordRetype} onChange={(e) => {
                        setPasswordRetype(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'This field cannot be empty',
                        },
                    ]}
                >
                    <Input placeholder="Phone" value={phone} onChange={(e) => {
                        setPhone(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input placeholder="Address" value={address} onChange={(e) => {
                        setAddress(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item>
                    <Button onClick={(e) => {
                        e.preventDefault();
                        if (password != passwordRetype) {
                            message.error("Password and password retype doesn't match", 3)
                        } else {
                            fetch("/api/register", {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                credentials: 'include',
                                method: "post",
                                body: JSON.stringify({
                                    username: username,
                                    password: password, 
                                    phone: phone,
                                    address: address
                                })
                            })
                            .then(res => {return res.json()})
                            .then(data => {
                                console.log(data);
                                if (data.msg === "OK") {
                                    navigate('/');
                                } else {
                                    message.error(data.msg, 3);
                                }
                            });
                        }
                    }} style={{width: "100%"}}>
                    Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
