import UserStorageLoader from "./components/pages/UserStorageLoader";
import Login from "./components/pages/Login"
import { AppContextMachine } from "./main"

function App() {
  const state = AppContextMachine.useSelector(state => state);

  switch(state.value){
    case "App Init":
      return (
        <UserStorageLoader message="Welcome!"/>
      )
    case "Get User Data":
      return (
        <UserStorageLoader message="Getting user data..."/>
      )
    case "Validate Credentials":
      return (
        <UserStorageLoader message="Validating Credentials..."/>
      )
    case "Logged Out":
      return(
        <Login/>
      )
  }
}

export default App
