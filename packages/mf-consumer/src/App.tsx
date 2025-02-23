import { init, loadRemote, registerRemotes } from "@module-federation/runtime";
import "./App.css";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
const CustomPlugin = {
  name: "custom-plugin",
  beforeInit(args: any) {
    console.log("beforeInit: ", args);
    return args;
  },
  init(args: any) {
    console.log("init: ", args);
    return args;
  },
  beforeRequest(args: any) {
    console.log("beforeRequest: ", args);
    return args;
  },
  afterResolve(args: any) {
    console.log("afterResolve: ", args);
    return args;
  },
  onLoad(args: any) {
    console.log("onLoad: ", args);
    return args;
  },
  async loadShare(args: any) {
    console.log("loadShare: ", args);
    return args;
  },
  async beforeLoadShare(args: any) {
    console.log("beforeLoadShare: ", args);
    return args;
  },
};

const options = {
  name: "mf_consumer",
  remotes: [
    { name: "mf_module1", entry: "http://localhost:3001/mf-manifest.json" },
    { name: "mf_module2", entry: "http://localhost:3002/mf-manifest.json" },
    // { name: "mf_module3", entry: "http://localhost:3003/mf-manifest.json" },
  ],
  plugins: [CustomPlugin],
  shared: {
    react: {
      version: "18.3.1",
      scope: "default",
      lib: () => React,
      shareConfig: {
        singleton: true,
        requiredVersion: "18.3.1",
      },
    },
    "react-dom": {
      version: "18.3.1",
      scope: "default",
      lib: () => ReactDOM,
      shareConfig: {
        singleton: true,
        requiredVersion: "18.3.1",
      },
    },
  },
};

init(options);

const ModuleLoader = ({ moduleId }: { moduleId: string }) => {
  if (!moduleId) {
    return <h2>No System specified</h2>;
  }
  const Component = lazy(() => loadRemote<any>(moduleId));
  return (
    <Suspense fallback={<h1>Loading... {moduleId}</h1>}>
      <Component />
    </Suspense>
  );
};

function App() {
  const [moduleId, setModuleId] = React.useState<string>("");

  const loadModule1 = () => setModuleId("mf_module1/app");
  const loadModule2 = () => setModuleId("mf_module2/app");

  const registerModule3 = () => () => {
    registerRemotes([{ name: "mf_module3", entry: "http://localhost:3003/mf-manifest.json" }]);
  };
  const loadModule3 = () => setModuleId("mf_module3/app");

  return (
    <>
      <header>
        <h1>Module Federation Consumer</h1>
        <h2>Click on the buttons to load the modules</h2>
        <button onClick={registerModule3()}>Add Module 3</button>
        <hr />
        <button onClick={loadModule1}>Module 1</button>
        <button onClick={loadModule2}>Module 2</button>
        <button onClick={loadModule3}>Module 3</button>
        <hr />
      </header>
      <main>
        <ModuleLoader moduleId={moduleId} />
      </main>
    </>
  );
}

export default App;
