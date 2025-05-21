import "./App.css";
import useSession from "./hooks/useSession";
// import useSession from "datakeen-session-react";

function App() {
  const { SessionComponent } = useSession("123");
  return <div>{SessionComponent}</div>;
}

export default App;
