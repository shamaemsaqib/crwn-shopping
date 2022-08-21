import React from "react";
import { Routes, Route } from "react-router-dom";
import { onSnapshot } from "firebase/firestore";
import { connect } from "react-redux/es/exports";

import "./App.css";

import Header from "./components/header/header.component";
import Register from "./pages/register/register.component";
import SectionsList from "./pages/sections-list/sections-list.component";
import Shop from "./pages/shop/shop.component";
import { addProfileDocumentToFirestore, auth } from "./firebase/firebase.utils";
import { setCurrentUser } from "./redux/user/user.actions";

class App extends React.Component {
  unsubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = await addProfileDocumentToFirestore(user);

        onSnapshot(userDocRef, (snapShot) => {
          console.log(snapShot.data());
          setCurrentUser({
            ...snapShot.data(),
          });
        });
      } else {
        setCurrentUser(user);
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div className="app">
        <Header />
        <Routes>
          <Route exact path="/" element={<SectionsList />} />
          <Route exact path="/shop" element={<Shop />} />
          <Route exact path="/sign-in" element={<Register />} />
        </Routes>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(App);
