import { useState, useEffect } from 'react';
import NavBar from './navBar';
import { Carousel } from 'antd';

export default function HomeView() {
    let [credential, setCredential] = useState();

    const tabStyle = {
        height: "810"
    }

    useEffect(() => {
        fetch('/api/auth', {
            method: "post",
            credentials: "include"
        })
        .then(res => { return res.json() })
        .then(data => { setCredential(data) });
    }, []);
    if (credential) {
        return (
            <div>
                <div>
                    <NavBar props={credential} />
                </div>
                <div>
                    <Carousel autoplay={true} dots={true} >
                        <div>
                            <h3 style={{margin: 0, height: '810px', color: '#fff', lineHeight: '160px', textAlign: 'center', background: '#364d79',}}>1</h3>
                        </div>
                        <div>
                            <h3 style={{margin: 0, height: '810px', color: '#fff', lineHeight: '160px', textAlign: 'center', background: '#364d79',}}>2</h3>
                        </div>
                        <div>
                            <h3 style={{margin: 0, height: '810px', color: '#fff', lineHeight: '160px', textAlign: 'center', background: '#364d79',}}>3</h3>
                        </div>
                    </Carousel>
                </div>
            </div>
        );
    }
}