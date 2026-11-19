import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import AddProduct from "./components/AddProduct";
import ViewProduct from "./components/ViewProduct";
import InvoiceView from "./components/InvoiceView";
import Login from "./login";

// 1. Protected Route - Bina login ke andar nahi jaane dega
function Protected({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// 2. Layout - Login page pe Navbar nahi dikhega, Print me bhi nahi
function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* Navbar - Login page pe hide + Print me hide */}
      {!isLoginPage && (
        <div className="print:hidden">
          <Navbar />
        </div>
      )}

      <div className="p-4 max-w-5xl mx-auto print:p-0 print:max-w-none">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route
            path="/add-product"
            element={
              <Protected>
                <AddProduct />
              </Protected>
            }
          />
          <Route
            path="/products"
            element={
              <Protected>
                <ViewProduct />
              </Protected>
            }
          />
          <Route
            path="/invoice/:id"
            element={
              <Protected>
                <InvoiceView />
              </Protected>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
