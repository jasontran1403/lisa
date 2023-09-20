import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Auth, Guest } from "./middlewares";
import Active from "./pages/Active";
import Authenticator from "./pages/Authenticator";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Exness from "./pages/Exness";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Investment from "./pages/Investment";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import ResendActive from "./pages/ResendActive";
import ResetPassword from "./pages/ResetPassword";
import SearchData from "./pages/SearchData";
import Share from "./pages/Share";
import Swap from "./pages/Swap";
import Transfer from "./pages/Transfer";
import TransferExternal from "./pages/TransferExternal";
import TreeView from "./pages/TreeView";
import Withdraw from "./pages/Withdraw";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/search-data"
                    element={
                        <Guest>
                            <SearchData />
                        </Guest>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <Guest>
                            <Login />
                        </Guest>
                    }
                />
                <Route
                    path="/register/:uuid"
                    element={
                        <Guest>
                            <Register />
                        </Guest>
                    }
                />
                <Route
                    path="/forgot-password"
                    element={
                        <Guest>
                            <ForgotPassword />
                        </Guest>
                    }
                />
                <Route
                    path="/resend-active"
                    element={
                        <Guest>
                            <ResendActive />
                        </Guest>
                    }
                />
                <Route
                    path="/active-account/:link"
                    element={
                        <Guest>
                            <Active />
                        </Guest>
                    }
                />
                <Route
                    path="/reset-password/:link"
                    element={
                        <Guest>
                            <ResetPassword />
                        </Guest>
                    }
                />

                <Route
                    path="/investment"
                    element={
                        <Auth>
                            <Investment />
                        </Auth>
                    }
                />
                <Route
                    path="/chia-ib"
                    element={
                        <Auth>
                            <Share />
                        </Auth>
                    }
                />
                <Route
                    path="/exness"
                    element={
                        <Auth>
                            <Exness />
                        </Auth>
                    }
                />
                <Route
                    path="/transferexternal"
                    element={
                        <Auth>
                            <TransferExternal />
                        </Auth>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <Auth>
                            <Dashboard />
                        </Auth>
                    }
                />
                <Route
                    path="/treeview"
                    element={
                        <Auth>
                            <TreeView />
                        </Auth>
                    }
                />
                <Route
                    path="/deposit"
                    element={
                        <Auth>
                            <Deposit />
                        </Auth>
                    }
                />
                <Route
                    path="/swap"
                    element={
                        <Auth>
                            <Swap />
                        </Auth>
                    }
                />
                <Route
                    path="/transfer"
                    element={
                        <Auth>
                            <Transfer />
                        </Auth>
                    }
                />
                <Route
                    path="/withdraw"
                    element={
                        <Auth>
                            <Withdraw />
                        </Auth>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <Auth>
                            <Profile />
                        </Auth>
                    }
                />
                <Route
                    path="/authenticator"
                    element={
                        <Auth>
                            <Authenticator />
                        </Auth>
                    }
                />
                <Route path="/*" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default App;
