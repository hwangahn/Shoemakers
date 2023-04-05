import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginView() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [disableLogin, setDisableLogin] = useState(false);
    let navigate = useNavigate();

    let handleLogin = (e) => {
        e.preventDefault();
        if (password !== "" && username !== "") {
            setDisableLogin(true);
            fetch("/api/login", {
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
            .then(res => { return res.json(); })
            .then(data => {
                console.log(data);
                if (data.msg === "OK") {
                    navigate('/');
                } else {
                    message.error("Wrong credentials");
                }
                setDisableLogin(false);
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
                <Form.Item>
                    <Button disabled={disableLogin} onClick={handleLogin} style={{width: "100%"}}>
                        Log in
                    </Button>
                    Or <Link to='/register'>Register now!</Link>
                </Form.Item>
            </Form>
        </div>
    );
};
