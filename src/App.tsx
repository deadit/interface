import { RustModule } from '@ergolabs/ergo-sdk';
import React, { Suspense, useEffect, useState } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import { initializeApp } from './common/streams/appTick';
import Layout from './components/common/Layout/Layout';
import { AppLoadingProvider, SettingsProvider } from './context';
import { globalHistory } from './createBrowserHistory';
import { ContextModalProvider } from './ergodex-cdk';
import { LanguageProvider } from './i18n/i18n';
import { AddLiquidityOrCreatePool } from './pages/AddLiquidityOrCreatePool/AddLiquidityOrCreatePool';
import { Liquidity } from './pages/Pool/Liquidity';
import { LockLiquidity } from './pages/Pool/LockLiquidity/LockLiquidity';
import { RelockLiquidity } from './pages/Pool/RelockLiquidity/RelockLiquidity';
import { RemoveLiquidity } from './pages/Pool/RemoveLiquidity/RemoveLiquidity';
import { WithdrawalLiquidity } from './pages/Pool/WithdrawalLiquidity/WithdrawalLiquidity';
import { PoolOverview } from './pages/PoolOverview/PoolOverview';
import { Swap } from './pages/Swap/Swap';

const NotFound = () => <Redirect to="/swap" />;

const Application = () => {
  return (
    <Router history={globalHistory}>
      <AppLoadingProvider>
        <SettingsProvider>
          <LanguageProvider>
            <ContextModalProvider>
              <Layout>
                <Switch>
                  <Route path="/" exact>
                    <Redirect to="/swap" />
                  </Route>
                  <Route path="/swap" exact component={Swap} />
                  <Route path="/pool" exact component={Liquidity} />
                  <Route
                    path="/pool/add"
                    exact
                    component={AddLiquidityOrCreatePool}
                  />
                  <Route
                    path="/pool/create"
                    exact
                    component={AddLiquidityOrCreatePool}
                  />
                  <Route
                    path="/pool/:poolId/remove"
                    exact
                    component={RemoveLiquidity}
                  />
                  <Route
                    path="/pool/:poolId/lock"
                    exact
                    component={LockLiquidity}
                  />
                  <Route
                    path="/pool/:poolId/relock"
                    exact
                    component={RelockLiquidity}
                  />
                  <Route
                    path="/pool/:poolId/withdrawal"
                    exact
                    component={WithdrawalLiquidity}
                  />
                  <Route
                    path="/pool/:poolId/add"
                    exact
                    component={AddLiquidityOrCreatePool}
                  />
                  <Route path="/pool/:poolId" exact component={PoolOverview} />
                  <Route component={NotFound} />
                </Switch>
              </Layout>
            </ContextModalProvider>
          </LanguageProvider>
        </SettingsProvider>
      </AppLoadingProvider>
    </Router>
  );
};

export const ApplicationInitializer: React.FC = () => {
  const [isRustModuleLoaded, setIsRustModuleLoaded] = useState(false);

  useEffect(() => {
    RustModule.load().then(() => {
      initializeApp();
      setIsRustModuleLoaded(true);
    });
  }, []);

  if (!isRustModuleLoaded) {
    return null;
  }

  return (
    <Suspense fallback={''}>
      <Application />
    </Suspense>
  );
};
