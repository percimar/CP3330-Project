//Carlos: Added search by category

import db from '../../db'
import React, { useState, useEffect, useContext } from "react";
import UserContext from '../../UserContext'
import AuctionDetails from './AuctionDetails'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import Auction from '../Auction'
import AuctionForm from '../AuctionForm'
import Category from './Category'
import CategoryForm from './CategoryForm'
import Button from '@material-ui/core/Button'
import styles from "../../assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function CategoriesView({set, setView}) {

  const { user } = useContext(UserContext)

  const classes = useStyles();

  const [auctions, setAuctions] = useState([])
  useEffect(() => db.Auctions.listenToUnfinished(setAuctions), [categoryId, user])

  const [selectAuction, setSelectAuction] = useState('')

  const [categories, setCategories] = useState([])
  useEffect(() => db.Categories.listenAll(setCategories), [user])

  const [categoryId, setCategoryId] = useState('')

  const [categoryName, setCategoryName] = useState('')

  const [viewCategory, setViewCategory] = useState(false)

  const selectNewCategory = (catId, name) => {
    if(catId === '') {
      db.Auctions.listenToUnfinished(setAuctions)
    }
    setCategoryId(catId)
    setViewCategory(false)
    setCategoryName(name)
  }

  const [testCat, setTestCat] = useState([])

  const [addAuction, setAddAuction] = useState(false)

  const [addCategory, setAddCategory] = useState(false)

  const [auctionsWithCat, setAuctionsWithCat] = useState([])

  useEffect(() => {
    setAuctionsWithCat([])
    auctions.map(auction => db.Auctions.Items.listenWithCategory(setAuctionsWithCat, auctionsWithCat, categoryId, auction.id))
    // db.Auctions.Items.getItemsWithCategory('aZ9GtJthtYn2Id0p1Ab2', 'X54I5YSOuNkcWuimFrzc', setAuctionsWithCat, auctionsWithCat)
  }, [categoryId])

  useEffect(() => {
    if (auctionsWithCat.length > 0) {
      db.Auctions.listenByCategory(setAuctions, auctionsWithCat)
    }
  }, [auctionsWithCat])

  return (
    <div className={classes.section}>
      {
          <>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8}>
                <h2 className={classes.title}>Categories</h2>
                {
                  categoryName &&
                  <>
                    <h3 className={classes.description}>Selected Category: {categoryName}</h3>
                  </>
                }
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <Button simple='true' color="primary" size="large" onClick={() => setView()}>View Auctions</Button>
                {
                  user && user.role!='user' &&
                <Button simple="true" color="primary" size="large" onClick={() => setAddCategory(!addCategory)}>{ !addCategory ? 'Add Category' : 'Close Form'}</Button>
                }
              </GridItem>
            </GridContainer>
            <GridContainer style={{ marginTop: '30px' }}>
              {
                addCategory &&
                <CategoryForm open={setAddCategory}/>
              }
              {
                categories.map(category =>
                  <Category key={category.id} set={selectNewCategory} category={category} {...category}></Category>
                )
              }
            </GridContainer>
          </>
      }

    </div>
  )
}
