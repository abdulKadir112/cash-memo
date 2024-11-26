import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayOut from "./RootLayOut";
import CashMemo from "./page/CashMemo";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayOut />}>
      <Route index element={<CashMemo />} />
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