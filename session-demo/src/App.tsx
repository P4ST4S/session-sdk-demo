import useSession from "./hooks/useSession";
// import useSession from "datakeen-session-react";

function App() {
  const { SessionComponent } = useSession("5b6875b470a0292aada8d398");
  return <div>{SessionComponent}</div>;
}

export default App;
