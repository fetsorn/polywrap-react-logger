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
  const [priority, setPriority] = React.useState(1)
  const [detail, setDetail] = React.useState(false)
      const plugins: PluginRegistration[] = [
        // IPFS is required for downloading Polywrap packages
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          plugin: ipfsPlugin({
            provider: "https://ipfs.io",
          }),
        },
        // ENS is required for resolving domain to IPFS hashes
        {
          uri: "wrap://ens/ens-resolver.polywrap.eth",
          plugin: ensResolverPlugin({}),
        },
        {
          uri: "wrap://ens/js-logger.polywrap.eth",
          plugin: loggerPlugin({}),
        },
        {
          uri: "wrap://ens/ipfs-resolver.polywrap.eth",
          plugin: ipfsResolverPlugin({
            provider: "https://ipfs.io",
          }),
        },
      ]

  return (
    <PolywrapProvider tracingEnabled={true} tracingLevel={priority} tracingDetailed={detail} plugins={plugins}>
      <Header />
      <div className='main'>
        <img src={Logo} className='main__logo' alt="" />
        <div>
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
