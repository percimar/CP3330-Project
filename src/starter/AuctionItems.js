
import React, { useEffect, useState, useContext } from 'react';
import GridItem from "../components/Grid/GridItem.js";
import Button from "../components/CustomButtons/Button.js";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardFooter from "../components/Card/CardFooter.js";
import Info from "../components/Typography/Info.js";
import Primary from "../components/Typography/Primary.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/landingPageSections/productStyle.js";
import { useParams } from 'react-router-dom';
import db from '../db'
import Item from './Item'
import GridContainer from "../components/Grid/GridContainer.js";
import UserContext from '../UserContext'
import { Link } from 'react-router-dom';


const useStyles = makeStyles(styles);

export default function AuctionItems() {

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();
    const { user } = useContext(UserContext)
    let { AuctionId } = useParams();

    const [items, setItem] = useState([])
    useEffect(() => db.Auctions.Items.listenToOneAuctionAllItems(setItem, AuctionId), [AuctionId])
    console.log("item: ", items)

    return (

        <div className={classes.section}>
            <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8}>
                    <h2 className={classes.title}>Auction Items</h2>
                    {
                        user && user.role === 'admin' ?
                            <Button simple color="primary" size="lg">Add Item</Button>
                            :
                            ''
                    }

                </GridItem>
            </GridContainer>
            <GridContainer>
                {
                    items.map(item => <Item key={""} {...item} />)
                }
            </GridContainer>
            <Button size="sm" color="primary" component={Link} to={`/`}>Back to Auctions</Button>
        </div>
    )
}