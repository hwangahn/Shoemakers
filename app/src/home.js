import { useState, useEffect } from 'react';
import NavBar from './navBar';
import { Carousel } from 'antd';

export default function HomeView() {
    let [credential, setCredential] = useState();

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
                    <Carousel autoplay={true} dots={true}>
                        <div>
                            <h3>1</h3>
                        </div>
                        <div>
                            <h3>2</h3>
                        </div>
                        <div>
                            <h3>3</h3>
                        </div>
                        <div>
                            <h3>4</h3>
                        </div>
                    </Carousel>
                </div>
            </div>
        );
    }
}