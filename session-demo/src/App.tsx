import useSession from "./hooks/useSession";
// import useSession from "datakeen-session-react";

function App() {
  const { SessionComponent } = useSession("1f53fce4a59791de274c841d");
  return <div>{SessionComponent}</div>;
}

export default App;
