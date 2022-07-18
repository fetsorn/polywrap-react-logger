import React from 'react';
import { PolywrapProvider } from '@polywrap/react';
import { HelloWorld } from './HelloWorld';
import { Header } from './Header';
import Logo from './logo.png';
import './App.css';
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { loggerPlugin } from "@polywrap/logger-plugin-js";
import { PluginRegistration } from "@polywrap/core-js";

export const App: React.FC = () => {
  const [priority, setPriority] = React.useState(1);
  const [detail, setDetail] = React.useState(false);
  const [url, setUrl] = React.useState("https://otel.fetsorn.website/v1/traces");
  const tracerConfig = {
    consoleEnabled: true,
    consoleDetailed: detail,
    httpEnabled: true,
    httpUrl: url,
    tracingLevel: priority
  }

  return (
    <PolywrapProvider tracerConfig={tracerConfig}>
      <Header />
      <div className='main'>
        <img src={Logo} className='main__logo' alt="" />
        <div>
          <label className='hello__text'>
            Priority: [0] all, [1] all, [2] important<br></br>
            <input
              type="text"
              className='hello__input'
              onChange={(event) => setUrl(event?.target.value ?? "https://otel.fetsorn.website/v1/traces")}
              placeholder="url"
            />
          </label>
          <br></br>
          <label className='hello__text'>
            Priority: [0] all, [1] all, [2] important<br></br>
            <input
              type="number"
              className='hello__input'
              onChange={(event) => setPriority(parseInt(event?.target.value))}
              placeholder="priority"
            />
          </label>
          <br></br>
          <label className='hello__text'>
            Check to see detailed logs
            <input
              type="checkbox"
              className='hello__input'
              onChange={(event) => setDetail(event?.target.checked)}
              placeholder="detail"
            />
          </label>
        </div>
        <HelloWorld />
      </div>
    </PolywrapProvider>
  );
};
