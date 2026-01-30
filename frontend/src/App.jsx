import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CodeView from "./pages/CodeView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/code/:slug" element={<CodeView />} />
    </Routes>
  );
}
