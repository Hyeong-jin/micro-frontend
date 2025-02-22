import { init, loadRemote } from "@module-federation/runtime";
import "./App.css";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";

const options = {
  name: "mf_consumer",
  remotes: [
    { name: "mf_module1", entry: "http://localhost:3001/mf-manifest.json" },
    { name: "mf_module2", entry: "http://localhost:3002/mf-manifest.json" },
    { name: "mf_module3", entry: "http://localhost:3003/mf-manifest.json" },
  ],
  plugins: [
    {
      name: "custom-plugin",
      beforeInit(args: any) {
        console.log("beforeInit: ", args);
        return args;
      },
      init(args: any) {
        console.log("init: ", args);
        return args;
      },
      beforeLoadShare(args: any) {
        console.log("beforeLoadShare: ", args);
        return args;
      },
    },
  ],
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

const System = ({ moduleId }: { moduleId: string }) => {
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
  const loadModule3 = () => setModuleId("mf_module3/app");
  return (
    <>
      <header>
        <button onClick={loadModule1}>Load Module 1</button>
        <button onClick={loadModule2}>Load Module 2</button>
        <button onClick={loadModule3}>Load Module 3</button>
      </header>
      <main>
        <System moduleId={moduleId} />
      </main>
    </>
  );
}

export default App;
