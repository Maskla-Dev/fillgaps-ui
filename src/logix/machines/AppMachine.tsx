import { assign, createMachine, fromPromise } from "xstate";
import { requestLogin, requestPhoto, requestUserSession, requestCredentialsValidation } from "../actions/UserSession";

const initial_context = {
  session: { 
    photo: "",
    id: 0,
    keys: { 
      access_key: "",
      refresh_key: "",
    },
    name: "", 
    role: "",
  },
  error: ""
}

export const AppMachine = createMachine(
  {
    id: "AppMachine",
    initial: "App Init",
    states: {
      "App Init": {
        always: {
          target: "Get user data",
        },
      },
      "Get user data": {
        invoke: {
          src: "getUserSession",
          id: "invoke-c5x59",
          onDone: {
            target: "Validate Credentials",
          },
          onError: {
            target: "Logged Out",
          },
        },
      },
      "Validate Credentials": {
        invoke: {
          src: "validateCredentials",
          id: "invoke-3azjd",
          input: ({context}) => ({ access_key: context.keys.access_key }),
          onDone: {
              target: "Get Photo",
              guard: "onDone",
          },
          onError: {
              target: "Logged Out",
              guard: "onError",
          },
        },
      },
      "Logged Out": {
        on: {
          "Send Credentials": {
            target: "Logging In",
            actions
          },
        },
      },
      "Get Photo": {
        invoke: {
          src: "getPhoto",
          id: "invoke-otdd0",
          input: ({context}) => ({access_key: context.keys.access_key}),
          onDone: {
            target: "FillGaps App",
          },
          onError: {
            target: "Wrong User Data",
            actions: [
              {type: "setError"}
            ]
          },
        },
      },
      "Logging In": {
        invoke: {
          src: "doLogin",
          id: "invoke-tzer1",
          input: ({event}) => ({user: event.user, password: event.password}),
          onDone: {
            target: "Get Photo",
          },
          onError: {
            target: "LogIn Error",
            actions: [
              {type: "setError"}
            ]
          },
        },
      },
      "FillGaps App": {
        on: {
          "Show Profile Info": {
            target: "Profile Info",
          },
        },
      },
      "Wrong User Data": {
        on: {
          Ok: {
            target: "FillGaps App",
          },
        },
      },
      "LogIn Error": {
        after: {
          "1200": {
            target: "#AppMachine.Logged Out",
            actions: [
              {type: "eraseError"}
            ],
          },
        },
      },
      "Profile Info": {
        on: {
          "Log out": {
            target: "Logged Out",
          },
          "Hide Profile Info": {
            target: "FillGaps App",
          },
        },
      },
    },
    schema: {
      events: {} as
        | { type: "Ok" }
        | { "type": "Login"; "200": number }
        | { type: "Log out" }
        | { type: "Send Credentials" }
        | { type: "Hide Profile Info" }
        | { type: "Show Profile Info" }
        | { "type": "Wrong User/Password"; "403": number }
        | { type: "" },
      context: {} as {
        session: { 
          photo: string; 
          id: number; 
          keys: { 
            access_key: string; 
            refresh_key: string;
          }; 
          name: string; role: string 
        };
        error: string;
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      setError: assign({
        error: ({event}) => event.error
      }),
      eraseError: assign({
        error: () => ""
      }),
      cleanData: assign({
        ...initial_context
      })
    },
    services: {
      doLogin: fromPromise(({input}) => requestLogin(input.user, input.password)),
      getPhoto: fromPromise(({input}) => requestPhoto(input.access_key)),
      getUserSession: fromPromise(() => requestUserSession()),
      validateCredentials: fromPromise(({input}) => requestCredentialsValidation(input.access_key)),
    },
    guards: {},
    delays: {},
  },
);


export default AppMachine;