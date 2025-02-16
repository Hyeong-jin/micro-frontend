import { lazy, Suspense } from "react";

const PureButton = lazy(() => import("AppPure/Button"));
const ShadowdomButton = lazy(() => import("AppShadowDOM/Button"));
const WebComponentsButton = lazy(() => import("AppWebComponents/Button"));

export const Buttons: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PureButton>Button 1</PureButton>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <ShadowdomButton>Button 2</ShadowdomButton>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <WebComponentsButton>Button 3</WebComponentsButton>
      </Suspense>
    </div>
  );
};
