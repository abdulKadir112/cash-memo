import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayOut from "./RootLayOut";
import Home from "./page/Home";
import CustomerBills from "./page/CustomerBills";
import ProductPage from "./components/ProductPage";
import ReportsOverview from "./components/ReportsOverview";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayOut />}>
      <Route index element={<Home />} />
      <Route path="/customer" element={<CustomerBills />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/report" element={<ReportsOverview />} />
    </Route>
  )
);


const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App