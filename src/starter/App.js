import React, { useEffect, useState } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import fb from '../fb'
import db from '../db'
import Register from './Register'
import Login from './Login'
import Logout from './Logout'
import Profile from './Profile'
import Faqs from '../Aahmad/Faqs'
import LandingPage from './LandingPage'
import AuctionItems from './AuctionItems'
import HeaderLinksLeft from './HeaderLinksLeft'
import HeaderLinksRight from './HeaderLinksRight'
import Header from "./Header";
import Admin from "./Admin";
import UserItems from "./UserItems";
import ResultItems from "../Aahmad/ResultItems";
import UserAuctions from "./UserAuctions";
import Following from '../Mahmoud/Following'
import Notifications from './Notifications'
import Bugs from '../Aahmad/Bugs'
import About from '../Aahmad/About'
import Results from '../Aahmad/Results'
import UserContext from '../UserContext'
import Logs from '../Asmar/Logs'

function App() {

  const [user, setUser] = useState(null) // db user object, not auth user object

  useEffect(() => {
    const findAndSetUser = async user => {
      let dbUser = null
      if (user) {
        dbUser = await db.Users.findOne(user.uid) // notice not listening to user object changes
        if (!dbUser) {
          await db.Users.update({ id: user.uid, name: "", role: "user" })
          dbUser = await db.Users.findOne(user.uid)
        }
      }
      setUser(dbUser)
    }
    return fb.auth().onAuthStateChanged(findAndSetUser)
  }, [])

  return (
    <Router>
      <UserContext.Provider value={{ user }}>
        <Header
          color="transparent"
          brand="MOTORMOB"
          leftLinks={<HeaderLinksLeft />}
          rightLinks={<HeaderLinksRight />}
          fixed
          changeColorOnScroll={{
            height: 400,
            color: "white"
          }}
        />

        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/Auction/Items/:AuctionId">
            <AuctionItems />
          </Route>
          <Route path="/Result/Items/:AuctionId">
            <ResultItems />
          </Route>
          <Route path="/Profile/:userId">
            <Profile />
          </Route>
          <Route path="/faqs">
            <Faqs />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/results">
            <Results />
          </Route>
          {
            user
              ?
              <>
                {
                  user.role === "admin"
                    ?
                    <>
                      <Route path="/admin">
                        <Admin />
                      </Route>
                      <Route path="/logs">
                        <Logs />
                      </Route>
                      {/* <Route path="/faqs">
                        <Faqs />
                      </Route> */}
                    </>
                    :
                    ""
                }
                <Route path="/useritems">
                  <UserItems />
                </Route>
                <Route path="/userauctions">
                  <UserAuctions />
                </Route>
                <Route path="/following">
                  <Following />
                </Route>
                <Route path="/notifications">
                  <Notifications />
                </Route>
                <Route path="/logout">
                  <Logout />
                </Route>
                <Route path="/bugs">
                  <Bugs />
                </Route>
                <Route path="/results">
                  <Results />
                </Route>
              </>
              :
              <>
                <Route path="/register">
                  <Register />
                </Route>
                <Route path="/login">
                  <Login />
                </Route>
              </>
          }
        </Switch>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
