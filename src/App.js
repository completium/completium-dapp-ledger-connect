import './App.css';
import React from 'react';
import LedgerButton from './components/LedgerButton';
import { createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { appTitle, appName, network } from './settings';
import { makeStyles } from '@material-ui/core/styles';
import { DAppProvider, useConnect } from './dapp.js';
import { ZCBProvider, useZCBStateContext } from './ZCBState';

function App() {
  return (
   <DAppProvider appName={appName}>
      <ZCBProvider>
        <React.Suspense fallback={null}>
            <PageRouter />
        </React.Suspense>
      </ZCBProvider>
    </DAppProvider>
  );
}

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
  },
}));

function PageRouter() {
  const classes = useStyles();
  var prefersDarkMode = false;
  const connect = useConnect();
  const theme = React.useMemo(
    () =>
      createMuiTheme(),
    [prefersDarkMode],
  );
  const handleConnect = React.useCallback(async () => {
    try {
      await connect(network);
    } catch (err) {
      alert(err.message);
    };
  }, [connect]);
  const margin = drawerWidth+'px';
  console.log(`margin: ${margin}`);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <LedgerButton appTitle={appTitle} handleConnect={handleConnect} theme={theme}></LedgerButton>
      <main className={classes.content}></main>
    </div>
  );
}


export default App;
