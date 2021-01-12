import React from 'react';
import constate from 'constate';
import { ThanosWallet } from '@thanos-wallet/dapp';
import { LedgerSigner, DerivationType } from '@taquito/ledger-signer';
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import { TezosToolkit } from "@taquito/taquito";


export const [
  DAppProvider,
  useWallet,
  useTezos,
  useAccountPkh,
  useReady,
  useConnect,
] = constate(
  useDApp,
  (v) => v.wallet,
  (v) => v.tezos,
  (v) => v.accountPkh,
  (v) => v.ready,
  (v) => v.connect
);

function useDApp({ appName }) {
  const [{ wallet, tezos, accountPkh }, setState] = React.useState(() => ({
    wallet: null,
    tezos: null,
    accountPkh: null,
  }));

  const ready = Boolean(tezos);

  React.useEffect(() => {
    return ThanosWallet.onAvailabilityChange((available) => {
      setState({
        wallet: available ? new ThanosWallet(appName) : null,
        tezos: null,
        accountPkh: null,
      });
    });
  }, [setState, appName]);

  const connect = React.useCallback(
    async (network, opts) => {
      try {
        const tezos = new TezosToolkit("https://delphinet-tezos.giganode.io");

        const transport = await TransportU2F.create();
        const ledgerSigner = new LedgerSigner(transport, `44'/1729'/0'/3'`, true, DerivationType.P256);
        tezos.setProvider({ signer: ledgerSigner });
        //Get the public key and the public key hash from the Ledger
        // const publicKey = await tezos.signer.publicKey();
        const publicKeyHash = await tezos.signer.publicKeyHash();


        // console.log(publicKeyHash);
        tezos.tz.getBalance(publicKeyHash).then ( balance => { console.log(`The balance of ${publicKeyHash} is ${balance.toNumber() / 1000000} ꜩ.\n`) });
        // tezos.tz.
        // tezos.setProvider({ wallet: this });
        // const tzs = wallet.toTezos();
        // const pkh = await tzs.wallet.pkh();
        setState({
          wallet: null,
          tezos: tezos,
          accountPkh: publicKeyHash,
        });
      } catch (err) {
        alert(`Failed to connect Ledger: ${err.message}`);
      }
    },
    [setState, wallet]
  );

  return {
    wallet,
    tezos,
    accountPkh,
    ready,
    connect,
  };
}

export function useOnBlock(tezos, callback) {
  const blockHashRef = React.useRef();

  React.useEffect(() => {
    let sub;
    spawnSub();
    return () => sub.close();

    function spawnSub() {
      sub = tezos.stream.subscribe('head');

      sub.on('data', (hash) => {
        if (blockHashRef.current && blockHashRef.current !== hash) {
          callback(hash);
        }
        blockHashRef.current = hash;
      });
      sub.on('error', (err) => {
        if (process.env.NODE_ENV === 'development') {
          console.error(err);
        }
        sub.close();
        spawnSub();
      });
    }
  }, [tezos, callback]);
}