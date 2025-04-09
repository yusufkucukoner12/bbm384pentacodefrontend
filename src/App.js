import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Login/Signup sayfaları
import Login from './pages/login-signup/Login';
import Signup from './pages/login-signup/Signup';
import AdminLogin from './pages/login-signup/AdminLogin';

// Customer sayfaları
import AccountManagement from './pages/customer/AccountManagement';
import MainPage from './pages/customer/MainPage';
import RestaurantPage from './pages/customer/RestaurantPage';
import OrderPage from './pages/customer/OrderPage';

// Restaurant sayfaları
import RestaurantAccountManagementPage from './pages/restaurant/RestaurantAccountManagementPage';
import MenuManagementPage from './pages/restaurant/MenuManagementPage';
import Orders from './pages/restaurant/Orders';
import CourierManagementPage from './pages/restaurant/CourierManagementPage';

// Courier sayfaları
import CourierAccountManagementPage from './pages/courier/CourierAccountManagementPage';
import AssignedOrders from './pages/courier/AssignedOrders';
import IdleOrders from './pages/courier/IdleOrders';
import OrderDetails from './pages/courier/OrderDetails';
import PastOrders from './pages/courier/PastOrders';

// Admin sayfaları
import AdminCourierManagementPage from './pages/admin/AdminCourierManagementPage';
import CustomerManagementPage from './pages/admin/CustomerManagementPage';
import DeliveryManagementPage from './pages/admin/DeliveryManagementPage';
import MainAdminPage from './pages/admin/MainAdminPage';
import RestaurantManagementPage from './pages/admin/RestaurantManagementPage';
import ReviewManagementPage from './pages/admin/ReviewManagementPage';

function App() {
  return (
    <Router>
      <div>
        {/* Navigasyon */}
        <nav>
          <Link to="/login">Giriş</Link> |{' '}
          <Link to="/customer/main">Müşteri</Link> |{' '}
          <Link to="/restaurant/account-management">Restoran</Link> |{' '}
          <Link to="/courier/account-management">Kurye</Link> |{' '}
          <Link to="/admin/main">Admin</Link>
        </nav>

        {/* Route tanımları */}
        <Routes>
          {/* Login/Signup */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-login" element={<AdminLogin />} /> {/* AdminLogin için mantıklı bir yol */}

          {/* Customer */}
          <Route path="/customer/main" element={<MainPage />} />
          <Route path="/customer/restaurants" element={<RestaurantPage />} />
          <Route path="/customer/order" element={<OrderPage />} />
          <Route path="/customer/account-management" element={<AccountManagement />} />

          {/* Restaurant */}
          <Route path="/restaurant/account-management" element={<RestaurantAccountManagementPage />} />
          <Route path="/restaurant/menu-management" element={<MenuManagementPage />} />
          <Route path="/restaurant/orders" element={<Orders />} />
          <Route path="/restaurant/courier-management" element={<CourierManagementPage />} />

          {/* Courier */}
          <Route path="/courier/account-management" element={<CourierAccountManagementPage />} />
          <Route path="/courier/assigned-orders" element={<AssignedOrders />} />
          <Route path="/courier/idle-orders" element={<IdleOrders />} />
          <Route path="/courier/order-details" element={<OrderDetails />} />
          <Route path="/courier/past-orders" element={<PastOrders />} />

          {/* Admin */}
          <Route path="/admin/main" element={<MainAdminPage />} />
          <Route path="/admin/courier-management" element={<AdminCourierManagementPage />} />
          <Route path="/admin/customer-management" element={<CustomerManagementPage />} />
          <Route path="/admin/delivery-management" element={<DeliveryManagementPage />} />
          <Route path="/admin/restaurant-management" element={<RestaurantManagementPage />} />
          <Route path="/admin/review-management" element={<ReviewManagementPage />} />

          {/* Varsayılan rota */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

