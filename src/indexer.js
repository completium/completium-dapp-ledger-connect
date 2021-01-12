import { network } from './settings';
import { useState, useEffect } from 'react';
import { useZCBStateContext } from './ZCBState';

const getUrl = (address) => {
  return "https://api.better-call.dev/v1/contract/"+network+"/"+ address +"/operations";
}

const addressToName = (state,address) => {
  if (state.contractInfo.issueraccount == address) {
    return state.contractInfo.issuer;
  } else {
    return state.contractInfo.subscriber;
  }
}

const options = {year: "numeric", month: "numeric", day: "numeric",
hour: "numeric", minute: "numeric", second: "numeric",
hour12: false};

export function useIndexer(address) {
  const [time, setTime] = useState(null);
  const { zcbState, addTimeline } = useZCBStateContext();

  async function handleResponse(time,response) {
    console.log(time);
    var operations = JSON.parse(response).operations;
    console.log(`indexer returns ${operations.length} operations`);
    if (operations.length + 1 > zcbState.timeline.length) {
      if (operations[0].kind === 'transaction') {
        switch (operations[0].entrypoint) {
          case 'sign':
            var signer = addressToName(zcbState,operations[0].source);
            var event = {
              date: new Intl.DateTimeFormat('en-GB',options).format(Date.now())/* operations[0].timestamp */,
              type: 'signature',
              label: 'Signed by '+signer,
              signer: signer,
              ophash: operations[0].hash
            };
            addTimeline(event);
            break;
          case 'terminate':
            var event = {
              date: new Intl.DateTimeFormat('en-GB',options).format(Date.now())/* operations[0].timestamp */,
              type: 'termination',
              label: 'Terminated',
              ophash: operations[0].hash
            };
            addTimeline(event);
            break;
          case 'dispute':
            var event = {
              date: new Intl.DateTimeFormat('en-GB',options).format(Date.now())/* operations[0].timestamp */,
              type: 'disputation',
              label: 'Disputed',
              ophash: operations[0].hash
            };
            addTimeline(event);
            break;
          default: console.log('unknow transaction!');
        }
      } else if (operations[0].kind === 'origination') {
        var event = {
          date: new Intl.DateTimeFormat('en-GB',options).format(Date.now())/* operations[0].timestamp */,
          type: 'origination',
          label: 'Issued',
          ophash: operations[0].hash
        };
        addTimeline(event);
      }
    }
  }

  useEffect(() => {
    if (address !== '') {
      const timer=setTimeout(() => {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            handleResponse(time,xmlHttp.responseText);
        }
        xmlHttp.open("GET", getUrl(address), true); // true for asynchronous
        xmlHttp.send(null);
        setTime(Date.now());
      }, 5000);
      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer);
    }
  });

  return null;
}

