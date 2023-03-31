import { Menu, Button, Drawer, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
const { Search } = Input;

function Logon( {props} ) {
    let navigate = useNavigate();
    let [isLoggedIn, setLoggedIn] = useState(props.isLoggedIn)
    if (isLoggedIn) {
        return (
            <>
                <Menu.Item key={"logout"}>
                    <Button type="primary" onClick={() => {
                        fetch('http://localhost:4000/api/logout', {
                            credentials: 'include',
                            method: 'post'
                        })
                        .then(() => {
                            setLoggedIn(false);
                            navigate('/');
                        })
                    }}>Log out</Button>
                </Menu.Item>
                <Menu.Item key={"cart"}>
                    <Button onClick={() => {
                        navigate('/cart');
                    }}>Cart</Button>
                </Menu.Item>
            </>
        );
    } else {
        return (
            <Menu.Item key={"login"}>
                <Button type="primary" onClick={() => {
                    navigate('/login');
                }}>Log in</Button>
            </Menu.Item>
        )
    }
}

export default function NavBar({ props }) {

    const [open, setOpen] = useState(false);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        console.log(keyword);
    }, [keyword])

    return (
        <>
            <Menu mode="horizontal" selectedKeys={[]} style={{width: "100%"}}>
                <Menu.Item key={"home"}>
                    <Link to={`/`}>Home</Link>
                </Menu.Item>
                <Menu.Item key={"man"}>
                    <Link to={`/gender/man`}>Man</Link>
                </Menu.Item>
                <Menu.Item key={"woman"}>
                    <Link to={`/gender/woman`}>Woman</Link>
                </Menu.Item>
                <Menu.Item key={"kid"}>
                    <Link to={`/gender/kid`}>Kid</Link>
                </Menu.Item>
                <Menu.Item key={"search"} style={{ alignSelf: 'right' }}>
                    <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => {
                        setOpen(true);
                    }} />
                </Menu.Item>
                <Logon props={props} />
            </Menu>
            <Drawer title="Search" placement="right" onClose={() => {
                setOpen(false);
            }} open={open}>
                <Search
                    placeholder="Search..."
                    onSearch={(value) => {
                        setKeyword(value);
                    }}
                    style={{width: 200}}
                />
            </Drawer>
            <br/>
        </>
    );
}