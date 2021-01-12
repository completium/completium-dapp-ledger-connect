import { useState } from 'react';
import constate from "constate";

const options = {year: "numeric", month: "numeric", day: "numeric",
hour: "numeric", minute: "numeric", second: "numeric",
hour12: false};

export function useZCBState() {
  const [zcbState, setZcbState] = useState({
    contractInfo : {
      issuer        : '',
      issueraccount : '',
      subscriber    : '',
      subscriberaccount: '',
      faceprice : '0',
      discount  : '0',
      duration  : '0',
      period    : '0',
    },
    contractState   : 'notcreated',
    contractAddress : '',
    signers         : [],
    timeline        : [
      { date: new Intl.DateTimeFormat('en-GB',options).format(Date.now()), type:'editionclosed', label: 'Edition closed' },
      /* { date: new Intl.DateTimeFormat('en-GB',options).format(Date.now()), type:'signature', label: 'Signed by Benoit Rognier', signer: 'Benoit Rognier', ophash: 'op' },
      { date: new Intl.DateTimeFormat('en-GB',options).format(Date.now()), type:'signature', label: 'Signed by Jean Claude Van Damme', signer:'Jean Claude Van Damme', ophash: 'op'}, */

    ]
  });
  const isReady = () => {
    return (zcbState.contractInfo.issuer            !== ''  &&
            zcbState.contractInfo.issueraccount     !== ''  &&
            zcbState.contractInfo.subscriber        !== ''  &&
            zcbState.contractInfo.subscriberaccount !== ''  &&
            zcbState.contractInfo.faceprice         !== '0' &&
            zcbState.contractInfo.discount          !== '0' &&
            zcbState.contractInfo.duration          !== '0' &&
            zcbState.contractInfo.period            !== '0');
  }
  const isCreated = () => {
    if (zcbState.contractState === 'notcreated') {
      return false;
    }
    return true;
  }
  const setContractInfo = (ci) => { setZcbState(zcb => { return {
    contractInfo     : ci,
    contractState    : zcb.constractState,
    contractAddress  : zcb.contractAddress,
    signers          : zcb.signers,
    timeline         : zcb.timeline
  }; })}
  const setContractAddress = (ca) => { setZcbState(zcb => { return {
    contractInfo     : zcb.contractInfo,
    contractState    : zcb.constractState,
    contractAddress  : ca,
    signers          : zcb.signers,
    timeline         : zcb.timeline
  }; })}
  const addTimeline = (event) => { setZcbState(zcb => { return {
    contractInfo     : zcb.contractInfo,
    contractState    : zcb.constractState,
    contractAddress  : zcb.contractAddress,
    signers          : zcb.signers,
    timeline         : [ ...zcb.timeline, event ]
  }; })}
  return { zcbState, setZcbState, isCreated, setContractInfo, isReady, setContractAddress, addTimeline };
}

export const [ZCBProvider, useZCBStateContext] = constate(useZCBState);