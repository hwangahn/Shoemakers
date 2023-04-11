import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Pagination, Card, Select, Spin, Slider, Space } from 'antd';
import NavBar from './navBar';

function SortAndFilter({ setSort, setRange }) {

    let formatter = (value) => `${value.toLocaleString('en-US')}₫`;

    return (
        <div style={{ width: "20%" , float: "left" }}>
            <Space direction='vertical'  style={{ width: "100%"}} >
                <Select style={{ width: "70%", marginLeft: "50px" }} placeholder="Sort by..." onChange={(value) => { setSort(value); }}>
                    <Select.Option value="price_asc">Sort by price ascending</Select.Option>
                    <Select.Option value="price_desc">Sort by price descending</Select.Option>
                    <Select.Option value="name_asc">Sort by name ascending</Select.Option>
                    <Select.Option value="name_desc">Sort by name descending</Select.Option>
                </Select>
                <Slider min={100000} max={10000000} range step={100000} defaultValue={[100000, 10000000]} 
                    tooltip={{formatter}} 
                    style={{ width: "70%", margin: "50px" }} 
                    marks={{ 100000: "100,000₫", 10000000: "10,000,000₫" }} 
                    onAfterChange={(value) => { setRange(value) }} 
                />
            </Space>
        </div>
    )
}

function ShoeCard({ props }) {
    let { sid, name, imageURL, gender, price } = props;
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
                <p>{`${price.toLocaleString('en-US')}₫`}</p>
                <br />
            </Card>
        </div>
    )
}

function ShoeRack({ allShoes, sort, range }) {

    let [page, setPage] = useState(1);

    let shoes = allShoes;
    let sortParam = sort.split('_');

    let shoesInRange = shoes.filter((element) => {
        if (parseInt(element.price) >= parseInt(range[0]) && parseInt(element.price) <= parseInt(range[1])) {
            return element;
        }
    });

    console.log(shoesInRange);
    
    if (sortParam[0] === "name") {
        shoesInRange.sort((a, b) => {
            if (a.name < b.name) {
                return ((sortParam[1] === "asc")? -1 : 1);
            } else if (a.name > b.name) {
                return ((sortParam[1] === "asc")? 1 : -1);
            } else {
                return 0;
            }
        });
    } else if (sortParam[0] === "price") {
        shoesInRange.sort((a, b) => {
            if (parseInt(a.price) < parseInt(b.price)) {
                return ((sortParam[1] === "asc")? -1 : 1);
            } else  if (parseInt(a.price) > parseInt(b.price)) {
                return ((sortParam[1] === "asc")? 1 : -1);
            } else {
                return 0;
            }
        });
    }

    let shoesInPage = shoesInRange.slice((page - 1) * 3, page * 3);

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
                            props={element}
                        />
                    )
                })}
            </div>
            <div>
                <Paging shoe={shoesInRange} setPage={setPage} />
            </div>
        </div>
    );
}

function Paging({ shoe, setPage }) {
    return (
        <div>
            <Pagination
                hideOnSinglePage
                defaultCurrent={1}
                pageSize={3}
                total={shoe.length}
                onChange={(value) => { setPage(value); }}
            />
        </div>
    );
}

export default function GoodsView() {
    let [credential, setCredential] = useState();
    let [allShoes, setAllShoes] = useState();
    let [sort, setSort] = useState("None");
    let [range, setRange] = useState([100000, 10000000]);

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
        .then(data => { setAllShoes(data.shoes) });
    }, [param]);

    if (credential && allShoes) {
        return (
            <div>
                <NavBar props={credential} />
                <SortAndFilter setSort={setSort} setRange={setRange} />
                <ShoeRack allShoes={allShoes} sort={sort} range={range} />
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