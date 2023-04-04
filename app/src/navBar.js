import { Menu, Button, Drawer, Input, Card, Affix } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
const { Search } = Input;

function Logon({ props }) {
    let navigate = useNavigate();
    let [loggedIn, setLoggedIn] = useState(props.isLoggedIn);

    let handleLogout = () => {
        fetch('/api/logout', {
            credentials: 'include',
            method: 'post'
        })
        .then(() => {
            setLoggedIn(false);
            navigate('/');
        })
    }

    if (loggedIn) {
        return (
            <>
                <Menu.Item key={"logout"} >
                    <Button type="primary" onClick={handleLogout}>Log out</Button>
                </Menu.Item>
                <Menu.Item key={"cart"} >
                    <Button onClick={() => { navigate('/cart'); }}>Cart</Button>
                </Menu.Item>
            </>
        );
    } else {
        return (
            <Menu.Item key={"login"} >
                <Button type="primary" onClick={() => { navigate('/login'); }}>Log in</Button>
            </Menu.Item>
        )
    }
}

function ShoeCard({ sid, name, imageURL, gender, price, setOpen }) {
    return (
        <div>
            <Card
                key={sid}
                className='shoe-card'
                hoverable
                style={{
                    width: 300,
                    margin: "20px",
                    borderRadius: "20px",
                    overflow: "hidden",
                }}
                cover={
                    <Link to={{pathname: `/shoe/${sid}`}} onClick={() => { setOpen(false) }}>
                        <img alt="example" src={imageURL} height='300' width='300' />
                    </Link>
                }
            >
                <Card.Meta title={name} description={gender} style={{float: 'left'}} />
                <p style={{float: 'right'}}>{`${price.toLocaleString('en-US')}₫`}</p>
                <br />
            </Card>
        </div>
    )
}

function ShoeRack({ props, setOpen }) {

    let shoesInPage = props.shoes;

    return (
        <div className='shoe-rack' style={{
            display: "flex",
            flexDirection: "column",
            flexDrap: "wrap"
        }}>
            {shoesInPage.map(element => {
                return (
                    <ShoeCard 
                        sid={element.sid} 
                        name={element.name} 
                        gender={element.gender} 
                        price={element.price} 
                        imageURL={element.imageURL}
                        setOpen={setOpen}
                    />
                )
            })}
        </div>
    );
}

export default function NavBar({ props }) {

    const [open, setOpen] = useState(false);
    const [shoes, setShoes] = useState(undefined);

    let handleSearch = (keyword) => {
        fetch(`/api/search/${keyword}`, {
            method: 'get', 
            credentials: 'include',
        })
        .then((data) => { return data.json() })
        .then((shoesFound) => {
            setShoes(shoesFound);
        })
    }

    return (
        <Affix>
            <div>
                <Menu mode="horizontal" defaultSelectedKeys={[]} style={{width: "100%", display: 'flex'}}>
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
                    <Menu.Item key={"search"} >
                        <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => {
                            setOpen(true);
                        }} />
                    </Menu.Item>
                    <Logon props={props} />
                </Menu>
                <Drawer title="Search" placement="right" onClose={() => { setOpen(false); }} open={open} >
                    <div>
                        <Search
                            placeholder="Search..."
                            onSearch={handleSearch}
                            style={{width: 325}}
                        />
                        {(shoes)? 
                        <ShoeRack props={shoes} setOpen={setOpen} /> :
                        <></>}
                    </div>
                </Drawer>
                <br/>
            </div>
        </ Affix>
    );
}