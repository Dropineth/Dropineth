import { HexString } from '@gear-js/api';

const ADDRESS = {
  NODE: "wss://testnet.vara.network" as string,
  CONTRACT: import.meta.env.VITE_CONTRACT_ADDRESS as HexString,
};

const ROUTE = {
  HOME: '/',
};

export { ADDRESS, ROUTE };
