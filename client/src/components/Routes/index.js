import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Routes,
  Switch,
} from "react-router-dom";
import Home from "../../pages/Home";
import Profil from "../../pages/Profil";
import Trending from "../../pages/Trending";
import NotFound from "../../pages/NotFound";
import Navbar from "../Navbar";

const index = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default index;
