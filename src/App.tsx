import "./index.css";
import "./assets/bg.jpeg";
import FetchData from "./FetchData";

function App() {
  return (
    <div className="h-screen w-screen bg-[url('./assets/bg.jpeg')]">
      <FetchData />
    </div>
  );
}

export default App;
