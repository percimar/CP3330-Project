import React, { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext'
import GridItem from "../components/Grid/GridItem.js";
import Button from "../components/CustomButtons/Button.js";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardFooter from "../components/Card/CardFooter.js";
import Info from "../components/Typography/Info.js";
import Primary from "../components/Typography/Primary.js";
import Danger from '../components/Typography/Danger.js'
import Success from '../components/Typography/Success'
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import db from '../db'

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import CustomInput from "../components/CustomInput/CustomInput.js";
import { useHistory, Link } from 'react-router-dom';
import AuctionForm from '../starter/AuctionForm'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

const useStyles = makeStyles(styles);

export default function Result({ set, id, displayName, finish, start, status }) {

    const { user } = useContext(UserContext)

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");

    //fix for unmount error
    useEffect(() => {
        const clear = setTimeout(() => setCardAnimation(""), 700)
        return () => clearTimeout(clear)
    }, [])


    const classes = useStyles();

    const [classicModal, setClassicModal] = React.useState(false);

    const [deleteModal, setDeleteModal] = useState(false)

    const [view, setView] = useState('details')

    const [seller, setSeller] = useState({ name: "" })

    const [items, setItems] = useState([])
    useEffect(() => db.Auctions.Items.listenToOneAuctionAllItems(setItems, id), [id])


    const [categories, setCategories] = useState([])
    useEffect(() => {
        setCategories([])
        items.map(item => db.Categories.listenOne(setCategories, item.catId, categories))
    }, [items])

    const history = useHistory()
    const [editForm, setEditForm] = useState(false)

    const seeDetails = () => {
        setClassicModal(true)
    }

    const confirmDelete = () => {
        setDeleteModal(true)
    }

    return (
        <>
            {
                !editForm ?
                    <>

                        <GridItem xs={12} sm={12} md={4}  style={{ height: "420px", width: "400px", textAlign: "center" , marginLeft: "15px"}}>
                            <Card className={classes[cardAnimaton]} style={{ height: "420px" }}>
                                <CardHeader color="primary" className={classes.cardHeader}>
                                    {displayName}
                                </CardHeader>
                                <CardBody>
                                    <Primary>
                                        Start
                                        </Primary>
                                    <Info>
                                        {start.toDateString()} <br />
                                        {start.toTimeString().substring(0, 8)}
                                    </Info>
                                    <br />
                                    <Primary>
                                        Finish
                                        </Primary>
                                    <Info>
                                        {finish.toDateString()} <br />
                                        {finish.toTimeString().substring(0, 8)}
                                    </Info>
                                    <br />
                                    <Primary>
                                        Categories
                                    </Primary>
                                    <Info>
                                        {
                                            // catNames.map(item => item).join(', ')
                                            categories.length > 0 ?
                                                categories.map(item => item.name).join(', ')
                                                :
                                                'No Categories'
                                        }
                                    </Info>
                                    <br />
                                </CardBody>
                                <CardFooter className={classes.cardFooter}>
                                    <Button size="sm" color="primary" component={Link} to={`/result/items/${id}`}>Show Items</Button>
                                    {
                                        user && user.role == 'admin' &&
                                        <>
                                            <Button color="primary" size="sm" onClick={() => confirmDelete(id)}>
                                                X
                                            </Button>
                                        </>
                                    }
                                </CardFooter>
                            </Card>
                        </GridItem>

                        <Dialog
                            classes={{
                                root: classes.center,
                                paper: classes.modal
                            }}
                            open={deleteModal}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={() => setDeleteModal(false)}
                            aria-labelledby="classic-modal-slide-title"
                            aria-describedby="classic-modal-slide-description"
                        >
                            <DialogTitle
                                id="classic-modal-slide-title"
                                disableTypography
                                className={classes.modalHeader}
                            >
                                <IconButton
                                    className={classes.modalCloseButton}
                                    key="close"
                                    aria-label="Close"
                                    color="inherit"
                                    onClick={() => setDeleteModal(false)}
                                >
                                    <Close className={classes.modalClose} />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent>
                            </DialogContent>
                            <DialogContent
                                id="classic-modal-slide-description"
                                className={classes.modalBody}
                            >
                                Delete {displayName}?
                            </DialogContent>
                            <DialogActions className={classes.modalFooter}>
                                <Button
                                    onClick={() => deleteAuction(id)}
                                    color="danger"
                                    simple
                                >
                                    Delete
                                    </Button>
                                <Button color="transparent" simple onClick={() => setDeleteModal(false)}>
                                    Cancel
                                    </Button>

                            </DialogActions>
                        </Dialog>

                    </>
                    :
                    ""
            }
        </>

    )
}