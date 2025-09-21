import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SellerDashboard from './Components/Seller/SellerDashboard';
import AdminDashboard from './Components/Admin/AdminDashboard';
import CustomerDashboard from './Components/CustomerDashboard';
import Razorpay from './Components/RazorpayPage.jsx';
import './App.css';

import Home from './Components/Home';


import ProductGallery from './Components/ProductGallery';
import ProductsHome from './Components/ProductsHome';
import ComputersPage from './Components/ProductPages/ComputersPage';
import FridgesPage from './Components/ProductPages/FridgesPage';
import MobilesPage from './Components/ProductPages/MobilesPage';
import WatchesPage from './Components/ProductPages/WatchesPage';
import MenwearPage from './Components/ProductPages/Menwear';
import WomanwearPage from './Components/ProductPages/Womanwear';
import SpeakersPage from './Components/ProductPages/Speakerspage';
import TvPage from './Components/ProductPages/TvPage';
import FurniturePage from './Components/ProductPages/FurniturePage';
import AcPage from './Components/ProductPages/AcPage';
import KitchenPage from './Components/ProductPages/KitchenPage';
import Cart from './Components/Cart';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyOrders from './Components/MyOrders';
import ManageProfile from './Components/ManageProfile';
import Forgotpassword from './Components/Forgotpassword';
import Resetpassword from './Components/Resetpassword';
import SellerOrders from './Components/Seller/SellerOrders.jsx';


export default function App() {
  return (
    <>
      <ToastContainer />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path='/sellerorders' element={<SellerOrders />}></Route>
        <Route path='/Cart' element={<Cart />}></Route>
        <Route path='/manage-profile' element={<ManageProfile />}></Route>
        <Route path='/forgot-password' element={<Forgotpassword />}></Route>
        <Route path='/reset-password' element={<Resetpassword />}></Route>
        <Route path='/checkout' element={<Razorpay />}></Route>
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path='/Cart' element={<Cart />}></Route>

        <Route path='/manage-profile' element={<ManageProfile />}></Route>
        <Route path='/forgot-password' element={<Forgotpassword />}></Route>
        <Route path='/reset-password' element={<Resetpassword />}></Route>
        <Route path='/checkout' element={<Razorpay />}></Route>
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path='/Cart' element={<Cart />}></Route>
        <Route path='/my-orders' element={<MyOrders />}></Route>
        <Route path='/manage-profile' element={<ManageProfile />}></Route>
        <Route path='/forgot-password' element={<Forgotpassword />}></Route>
        <Route path='/reset-password' element={<Resetpassword />}></Route>
        <Route path='/checkout' element={<Razorpay />}></Route>

        <Route path='/ProductGallery' element={<ProductGallery />}></Route>
        <Route path='/Productshome' element={<ProductsHome />}></Route>
        <Route path='/ProductsHome/Computers' element={<ComputersPage />}></Route>
        <Route path='/ProductsHome/Fridges' element={<FridgesPage />}></Route>
        <Route path='/ProductsHome/Mobiles' element={<MobilesPage />}></Route>
        <Route path='/ProductsHome/Watches' element={<WatchesPage />}></Route>
        <Route path='/ProductsHome/Menwear' element={<MenwearPage />}></Route>
        <Route path='/ProductsHome/Womanwear' element={<WomanwearPage />}></Route>
        <Route path='/ProductsHome/speaker' element={<SpeakersPage />}></Route>
        <Route path='/ProductsHome/tv' element={<TvPage />}></Route>
        <Route path='/ProductsHome/furniture' element={<FurniturePage />}></Route>
        <Route path='/ProductsHome/kitchen' element={<KitchenPage />}></Route>
        <Route path='/ProductsHome/ac' element={<AcPage />}></Route>



      </Routes>
    </>
  );
}
