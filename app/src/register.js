import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterView() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [passwordRetype, setPasswordRetype] = useState("");
    let [phone, setPhone] = useState("");
    let [address, setAddress] = useState("");
    let [disableRegister, setDisableRegister] = useState(false);
    let navigate = useNavigate();

    let handleRegister = (e) => {
        e.preventDefault();
        let passwordFormat = RegExp(/^(\w*(([a-z]+[A-Z]+\d+)|([a-z]+\d+[A-Z]+)|([A-Z]+[a-z]+\d+)|([A-Z]+\d+[a-z]+)|(\d+[A-Z]+[a-z]+)|(\d+[a-z]+[A-Z]+))\w*)$/);
        let phoneFormat = RegExp(/^0(?!0)[0-9]{9,10}$/); 
        if (password != passwordRetype) {
            message.error("Password and password retype doesn't match")
        } else if (!passwordFormat.test(password)){
            message.error("Password must contain at least one lowercase letter, one uppercase letter and one number and cannot contain special characters");
        } else if (password.length < 8){
            message.error("Password must have 8 or more characters");
        } else if (!phoneFormat.test(phone)){
            message.error("Please enter a valid phone number");
        } else if (username !== "" && password !== "" && phone !== "" && address !== "") {
            setDisableRegister(true);
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
            .then(res => { return res.json(); })
            .then(data => {
                console.log(data);
                if (data.msg === "OK") {
                    navigate('/');
                } else {
                    message.error(data.msg);
                }
                setDisableRegister(false);
            });
        } else {
            message.error("Please fill in the missing information");
        }
    }

    return ( 
        <div style={{width: "100%"}}>
            <Form style={{maxWidth: "300px", alignSelf: "center"}}>
                <Form.Item name="username" >
                    <Input placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value); }} />
                </Form.Item>
                <Form.Item name="password" >
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); }} />
                </Form.Item>
                <Form.Item name="passwordRetype" >
                    <Input type="password" placeholder="Retype password" value={passwordRetype} onChange={(e) => { setPasswordRetype(e.target.value); }} />
                </Form.Item>
                <Form.Item name="phone" >
                    <Input placeholder="Phone" value={phone} onChange={(e) => { setPhone(e.target.value); }} />
                </Form.Item>
                <Form.Item name="address" >
                    <Input placeholder="Address" value={address} onChange={(e) => { setAddress(e.target.value); }} />
                </Form.Item>
                <Form.Item>
                    <Button disabled={disableRegister} onClick={handleRegister} style={{width: "100%"}}>
                    Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
