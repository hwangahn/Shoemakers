import { Form, Input, Button, Alert, Space } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginView() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [error, setError] = useState(false);
    let navigate = useNavigate();
    return ( 
        <div style={{width: "100%"}}>
            <Form style={{maxWidth: "300px", alignSelf: "center"}}>
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Username cannot be empty',
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
                            message: 'Password cannot be empty',
                        },
                    ]}
                >
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => {
                        setPassword(e.target.value);
                    }} />
                </Form.Item>
                <Form.Item>
                    <Button onClick={(e) => {
                        e.preventDefault();
                        fetch("http://localhost:4000/api/login", {
                            credentials: 'include',
                            headers: {
                                "Content-Type": "application/json",
                            },
                            method: "post",
                            body: JSON.stringify({
                                username: username,
                                password: password
                            })
                        })
                        .then(res => {return res.json()})
                        .then(data => {
                            console.log(data);
                            if (data.msg === "OK") {
                                navigate('/');
                            } else {
                                setError(true);
                            }
                        })
                    }} style={{width: "100%"}}>
                    Log in
                    </Button>
                    Or <Link to='/register'>register now!</Link>
                </Form.Item>
            </Form>
            {error? 
            <Space direction='vertical'>
                <Alert message="Wrong credentials" type="error" closable onClose={() => {
                    setError(false);
                }} />
            </Space> :
            <></>
            }
        </div>
    );
};