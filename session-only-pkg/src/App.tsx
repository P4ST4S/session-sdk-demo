import useSession from "datakeen-session-react";

function App() {
  const { SessionComponent } = useSession("123");
  return <>{SessionComponent}</>;
}

export default App;
