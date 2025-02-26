import { RetryPlugin as LoadModuleRetryPlugin } from "@module-federation/retry-plugin";
import { FederationRuntimePlugin, init, loadRemote } from "@module-federation/runtime";
import { Remote } from "@module-federation/runtime/types";
import React, { lazy, Suspense, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import { ErrorBoundary } from "react-error-boundary";
import "./App.css";

const CustomPlugin: FederationRuntimePlugin = {
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
  errorLoadRemote(args: any) {
    console.log("[ Module Federation Load Remote Error ]", args);
    return {
      default: () => (
        <div>
          <h1>Failed to load remote</h1>
        </div>
      ),
    };
  },
  loadEntryError(args: any) {
    console.log("loadEntryError: ", args);
    return args;
  },
};

const initialRemotes = [
  { name: "mf_module1", entry: "http://localhost:3001/mf-manifest.json" },
  { name: "mf_module2", entry: "http://localhost:3002/mf-manifest.json" },
  // { name: "mf_module3", entry: "http://localhost:3003/mf-manifest.json" },
];

const options = {
  name: "mf_consumer",
  remotes: [...initialRemotes],
  plugins: [
    CustomPlugin,
    LoadModuleRetryPlugin({
      fetch: {},
      script: {
        //   retryTimes: 3,
        //   retryDelay: 100,
        cb: (resolve, error) => {
          return setTimeout(() => {
            resolve(error);
          }, 100);
        },
      },
    }),
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

const federationHost = init(options);

const ModuleLoader = ({ moduleId }: { moduleId: string }) => {
  if (!moduleId) {
    return <h2>No System specified</h2>;
  }

  const Component = lazy(() => loadRemote<any>(moduleId));

  return (
    <ErrorBoundary fallback={<h1>Failed to load {moduleId}</h1>}>
      <Suspense fallback={<h1>Loading... {moduleId}</h1>}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

function App() {
  const [remotes, setRemotes] = React.useState<Remote[]>([...initialRemotes]);
  const [moduleId, setModuleId] = React.useState<string>("");

  useEffect(() => {
    federationHost.options.remotes = remotes;
  }, [remotes]);

  const hasRemote = useCallback(
    (name: string) => {
      return remotes.some((remote) => remote.name === name);
    },
    [remotes],
  );

  const loadModule1 = () => setModuleId("mf_module1/app");
  const loadModule2 = () => setModuleId("mf_module2/app");

  const registerRemote3 = (name: string) => {
    if (!hasRemote(name)) {
      setRemotes([...remotes, { name: "mf_module3", entry: "http://localhost:3003/mf-manifest.json" }]);
    }
  };

  const removeRemote3 = (name: string) => {
    setRemotes(remotes.filter((remote) => remote.name !== name));
  };

  const loadModule3 = () => setModuleId("mf_module3/app");
  const loadModule4 = () => setModuleId("mf_module1/retry-when-network-error");

  return (
    <>
      <header>
        <h1>Module Federation Consumer</h1>
        <button
          onClick={() => {
            registerRemote3("mf_module3");
          }}
        >
          Add Remote 3
        </button>
        <button
          onClick={() => {
            removeRemote3("mf_module3");
          }}
        >
          Remove Remote 3
        </button>
        <hr />
        <button onClick={loadModule1}>Module 1</button>
        <button onClick={loadModule2}>Module 2</button>
        {hasRemote("mf_module3") && (
          <>
            <button onClick={loadModule3}>Module 3</button>
          </>
        )}
            <button onClick={loadModule4}>Retry fetch</button>

        <hr />
      </header>
      <main>
        <ModuleLoader moduleId={moduleId} />
      </main>
    </>
  );
}

export default App;
