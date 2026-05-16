
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const RootLayout = () => {




    const key = localStorage.getItem("key");


    if (key) {

        return <Outlet />
    } else {

        return <Navigate to="/login" />
    }






}

export default RootLayout
