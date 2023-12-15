import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { createActorContext } from "@xstate/react"
import AppMachine from "./logix/machines/AppMachine.tsx"

export const AppContextMachine = createActorContext(AppMachine);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppContextMachine.Provider>
        <App />
    </AppContextMachine.Provider>
  </React.StrictMode>,
)
