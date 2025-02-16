import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Buttons } from "./pages/Buttons";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path=""
          element={<Layout />}
        >
          <Route
            index
            path="/"
            element={<Home />}
          />

          <Route
            path="/buttons"
            element={<Buttons />}
          />
        </Route>
        <Route
          path="*"
          element={<div>Not Found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
