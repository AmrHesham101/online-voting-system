import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import MainHeader from "./MainHeader";
import SideDrawer from "./SideDrawer";
import "./MainNavigation.css";
import NavLinks from "./NavLinks";
import Backdrop from "../UIElements/Backdrop";
import { ThemeContext } from "../../context/theme-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
function MainNavigation(props) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };
  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };
  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <div className="header-left">
          <button
            className="main-navigation__menu-btn"
            onClick={openDrawerHandler}
          >
            <span />
            <span />
            <span />
          </button>
          <h1 className="main-navigation__title">
            <Link to="/">TOPICS</Link>
          </h1>
        </div>
        <div className="header-right nav">
          <button onClick={() => toggleTheme()}>
            <FontAwesomeIcon
              icon={theme === "light-theme" ? faSun : faMoon}
              size="2x"
            />
          </button>
          <nav className="main-navigation__header-nav">
            <NavLinks />
          </nav>
        </div>
      </MainHeader>
    </>
  );
}

export default MainNavigation;
