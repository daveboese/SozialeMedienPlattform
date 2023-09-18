import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { UidContext } from "./AppContext";
import Logout from "./Log/Logout";

const Navbar = () => {
  const uid = useContext(UidContext);
  const userData = useSelector((state) => state.userReducer);

  return (
    <nav>
      <div className="nav-container">
        <div className="logo">
          <NavLink exact to="/">
            <div className="logo">
              <img src="./img/icon.png" alt="icon" />
              <h3>ShareSpace</h3>
            </div>
          </NavLink>
        </div>
        <ul>
          <li></li>
          {uid ? (
            <>
              <li className="welcome">
                <NavLink exact to="/profil">
                  <h5>Welcome {userData.pseudo}</h5>
                </NavLink>
              </li>
              <li>
                <Logout />
              </li>
            </>
          ) : (
            <li>
              <NavLink exact to="/profil">
                <img src="./img/icons/login.svg" alt="login" />
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
