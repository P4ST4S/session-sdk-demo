import useSession from "./hooks/useSession";
// import useSession from "datakeen-session-react";

function App() {
  const { SessionComponent } = useSession("22f5a48b1a1008b684379291");
  return <div>{SessionComponent}</div>;
}

export default App;
