import "./App.css";
import useSession from "./hooks/useSession";

function App() {
  const { SessionComponent } = useSession("123");
  return <div>{SessionComponent}</div>;
}

export default App;
