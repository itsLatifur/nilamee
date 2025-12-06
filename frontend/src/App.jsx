import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
} from "react-router-dom";
import SideDrawer from "./layout/SideDrawer";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <SideDrawer />
        <Route path="/" element={<Home />} />
      </Routes>
      <ToastContainer position="top-right" />
    </Router>
  );
};

export default App;
