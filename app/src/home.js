import { useState, useEffect } from 'react';
import NavBar from './navBar';

export default function HomeView() {
    let [credential, setCredential] = useState();

    useEffect(() => {
        fetch('http://localhost:4000/api/auth', {
            method: "post",
            credentials: "include"
        })
        .then(res => { return res.json() })
        .then(data => { setCredential(data) });
    }, []);
    if (credential) {
        return (
            <NavBar props={credential} />
        );
    }
}