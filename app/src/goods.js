import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Pagination, Card, Select, Spin } from 'antd';
import NavBar from './navBar';

function Sort({ setSort }) {
    return (
        <div style={{ width: "20%" , float: "left" }}>
            <Select style={{width: 200}} placeholder="Sort by..." onChange={(value) => {
                setSort(value)
            }}>
                <Select.Option value="price_asc">Sort by price ascending</Select.Option>
                <Select.Option value="price_desc">Sort by price descending</Select.Option>
                <Select.Option value="name_asc">Sort by name ascending</Select.Option>
                <Select.Option value="name_desc">Sort by name descending</Select.Option>
            </Select>
        </div>
    )
}

function ShoeCard({ sid, name, imageURL, gender, price }) {
    return (
        <div>
            <Card
                key={sid}
                className='shoe-card'
                hoverable
                style={{
                    width: "300",
                    margin: "20px",
                    borderRadius: "20px",
                    overflow: "hidden",
                }}
                cover={
                    <Link to={{pathname: `/shoe/${sid}`}}>
                        <img alt="example" src={imageURL} height='300' width='300' />
                    </Link>
                }
            >
                <Card.Meta title={name} description={gender}  />
                <p>{price}</p>
                <br />
            </Card>
        </div>
    )
}

function ShoeRack({ props, sort }) {

    let [page, setPage] = useState(1);

    let shoes = props.shoes;
    let sortParam = sort.split('_');
    
    if (sortParam[0] === "name") {
        shoes.sort((a, b) => {
            if (a.name < b.name) {
                return ((sortParam[1] === "asc")? -1 : 1);
            } else if (a.name > b.name) {
                return ((sortParam[1] === "asc")? 1 : -1);
            } else {
                return 0;
            }
        });
    } else if (sortParam[0] === "price") {
        shoes.sort((a, b) => {
            if (parseInt(a.price) < parseInt(b.price)) {
                return ((sortParam[1] === "asc")? -1 : 1);
            } else  if (parseInt(a.price) > parseInt(b.price)) {
                return ((sortParam[1] === "asc")? 1 : -1);
            } else {
                return 0;
            }
        });
    }

    let shoesInPage = shoes.slice((page - 1) * 3, page * 3);

    return (
        <div className='shoe-rack' style={{ width: "80%" , float: "right" }}>
            <div  style={{
                display: "flex",
                flexDirection: "row",
                flexDrap: "wrap"
            }}>
                {shoesInPage.map(element => {
                    return (
                        <ShoeCard 
                            sid={element.sid} 
                            name={element.name} 
                            gender={element.gender} 
                            price={`${element.price.toLocaleString('en-US')}₫`} 
                            imageURL={element.imageURL}
                        />
                    )
                })}
            </div>
            <div>
                <Paging shoe={shoes} setPage={setPage} />
            </div>
        </div>
    );
}

function Paging({ shoe, setPage }) {
    return (
        <div>
            <Pagination
                defaultCurrent={1}
                pageSize={3}
                total={shoe.length}
                onChange={(value) => {
                    setPage(value)
                }}
            />
        </div>
    );
}

export default function GoodsView() {
    let [credential, setCredential] = useState();
    let [allShoes, setAllShoes] = useState();
    let [sort, setSort] = useState("None");

    let param = useParams();
    
    useEffect(() => {
        fetch('/api/auth', {
            method: "post",
            credentials: 'include'
        })
        .then(res => { return res.json() })
        .then(data => { setCredential(data) });

        fetch(`/api/gender/${param.gender}`)
        .then(res => { return res.json() })
        .then(data => { setAllShoes(data) });
    }, [param]);

    if (credential && allShoes) {
        console.log(allShoes);
        return (
            <div>
                <NavBar props={credential} />
                <Sort setSort={setSort} />
                <ShoeRack props={allShoes} sort={sort} />
            </div>
        )
    } else {
        return (
            <div>
                <Spin />
            </div>
        )
    }
}