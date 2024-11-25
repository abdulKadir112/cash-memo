import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./page/Dashboard";
import RootLayOut from "./RootLayOut";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayOut />}>
      <Route index element={<Dashboard />} />
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