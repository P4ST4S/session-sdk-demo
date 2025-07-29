import useSession from "./hooks/useSession";
// import useSession from "datakeen-session-react";

function App() {
  const { SessionComponent } = useSession("4266e51523a22e2f25bb38b3");
  return <div>{SessionComponent}</div>;
}

export default App;
