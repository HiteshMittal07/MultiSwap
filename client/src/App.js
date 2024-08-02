import "./App.css";
import Header from "./Header";
import "react-toastify/dist/ReactToastify.css";
import MultiSwapWidget from "./MultiSwapWidget";
import { useState } from "react";

const App = () => {
  const [connected, setConnected] = useState(false);
  return (
    <div className="App">
      <Header setConnected={setConnected} />
      <h1 className="text-8xl">Multi Swap</h1>
      <MultiSwapWidget connected={connected} />
    </div>
  );
};

export default App;
