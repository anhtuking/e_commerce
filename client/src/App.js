import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Login,
  Home,
  Public,
  FAQs,
  DetailProduct,
  Blogs,
  Services,
  Products,
  FinalRegister,
  ResetPassword,
} from "./pages/publics";
import path from "./utils/path";
import { getCategories } from "./store/app/asyncAction";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  return (
    <div className="min-h-screen font-main">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.OUR_SERVICES} element={<Services />} />
          <Route
            path={path.DETAIL_PRODUCT__PID__TITLE}
            element={<DetailProduct />}
          />
          <Route path={path.FAQ} element={<FAQs />} />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.LOGIN} element={<Login />} />
      </Routes>
      <ToastContainer
        position="top-right"  // vi tri
        autoClose={3000}  // close sau 5s
        hideProgressBar={false} //thanh luot phia duoi
        newestOnTop={false} // thong bao moi nhat xuat hien dau tien
        closeOnClick={false}  // click de close
        rtl={false}
        pauseOnFocusLoss
        draggable // keo tha
        pauseOnHover  // hover vao se dung dem gio
        theme="colored"
      />
    </div>
  );
}

export default App;
