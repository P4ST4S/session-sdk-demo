import useSession from "./hooks/useSession";
// import useSession from "datakeen-session-react";

function App() {
  const { SessionComponent } = useSession("b6c4c1d5f3cfa8ff6cf94a62");
  return <div>{SessionComponent}</div>;
}

export default App;
