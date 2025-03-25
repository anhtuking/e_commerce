import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  Login,
  PublicLayout,
  FAQs,
  DetailProduct,
  Blogs,
  Services,
  Products,
  FinalRegister,
  ResetPassword,
} from "pages/publics";
import Home from "pages/publics/Home";
import { AdminLayout, CreateProduct, Dashboard, ManageProduct, ManageOrder, ManageUser  } from "pages/admin";
import { MemberLayout, Personal, Wishlist, MyOders, DetailCart } from "pages/member";
import path from "utils/path";
import { getCategories } from "store/app/asyncAction";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { Cart, Modal } from "components";
import { showCart } from "store/app/appSlice";

function App() {
  const dispatch = useDispatch();
  const {isShowModal, modalChildren, isShowCart} = useSelector(state => state.app)
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  return (
    <div className="font-main h-screen relative">
      {isShowCart && <div onClick={() => dispatch(showCart({signal: false}))} className="absolute inset-0 bg-overlay z-[50000] flex justify-end">
        <Cart />
      </div>}
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        <Route path={path.PUBLIC} element={<PublicLayout />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blogs />} />
          <Route path={path.OUR_SERVICES} element={<Services />}/>
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct />}/>
          <Route path={path.FAQ} element={<FAQs />}/>
          <Route path={path.PRODUCTS} element={<Products />}/>
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />}/>
          <Route path={path.ALL} element={<Home />} />
        </Route>
        <Route path={path.ADMIN} element={<AdminLayout/>}>
          <Route path={path.DASHBOARD} element={<Dashboard/>}/>
          <Route path={path.MANAGE_ORDER} element={<ManageOrder/>}/>
          <Route path={path.MANAGE_PRODUCT} element={<ManageProduct/>}/>
          <Route path={path.MANAGE_USER} element={<ManageUser/>}/>
          <Route path={path.CREATE_PRODUCT} element={<CreateProduct/>}/>
        </Route>
        <Route path={path.MEMBER} element={<MemberLayout/>}>
          <Route path={path.PERSONAL} element={<Personal/>}/>
          <Route path={path.MY_CART} element={<DetailCart/>}/>
          <Route path={path.WISHLIST} element={<Wishlist id='wishlist'/>}/>
          <Route path={path.MY_ORDER} element={<MyOders id='order'/>}/>
        </Route>
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />}/>
        <Route path={path.LOGIN} element={<Login />}/>
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
