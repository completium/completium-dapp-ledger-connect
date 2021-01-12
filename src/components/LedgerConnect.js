import React from 'react';
import Button from '@material-ui/core/Button';
import { LedgerSigner, DerivationType } from '@taquito/ledger-signer';
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import { TezosToolkit } from "@taquito/taquito";

export default function LedgerConnect(props) {
  const [ready, setReady] = React.useState(false);

  const { tezos, handleSelected } = props;
  // const createTransport = () => {
  //   try {
  //     const transport = await TransportU2F.create();
  //     setReady(true);
  //     return transport;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  const updateTezos = (accountId = 0, changeId = 0, dt = DerivationType.ED25519) => {
    // const transport = await TransportU2F.create();
    // const ledgerSigner = new LedgerSigner(transport, `44'/1729'/${accountId}'/${changeId}'`, true, dt);
    // tezos.setProvider({ signer: ledgerSigner });
    // const publicKeyHash = await tezos.signer.publicKeyHash();
    const publicKeyHash = 'tz1bivjTpG3xTvcJTKnu1kVK1Fmp8gA9mV8w';

    handleSelected(publicKeyHash);
  }

  const handleClickOpen = () => {
    updateTezos();
  }

  return (
    <div>
      <Button onClick={handleClickOpen}> Select </Button>
    </div>

  );
}