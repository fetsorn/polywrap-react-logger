// @ts-ignore
import * as Types from "./";

// @ts-ignore
import {
  Client,
  InvokeResult
} from "@polywrap/core-js";

export type UInt = number;
export type UInt8 = number;
export type UInt16 = number;
export type UInt32 = number;
export type Int = number;
export type Int8 = number;
export type Int16 = number;
export type Int32 = number;
export type Bytes = Uint8Array;
export type BigInt = string;
export type BigNumber = string;
export type Json = string;
export type String = string;
export type Boolean = boolean;

/// Imported Modules START ///

/* URI: "wrap://ipfs/QmbD6vJJRXQRj1YLszjhxNjUrCj8xRzbokc2vLYMcR8ZuQ" */
interface HelloWorld_Module_Args_logMessage extends Record<string, unknown> {
  message: Types.String;
}

/* URI: "wrap://ipfs/QmbD6vJJRXQRj1YLszjhxNjUrCj8xRzbokc2vLYMcR8ZuQ" */
export const HelloWorld_Module = {
  logMessage: async (
    args: HelloWorld_Module_Args_logMessage,
    client: Client,
    uri: string = "wrap://ipfs/QmbD6vJJRXQRj1YLszjhxNjUrCj8xRzbokc2vLYMcR8ZuQ"
  ): Promise<InvokeResult<Types.Boolean>> => {
    return client.invoke<Types.Boolean>({
      uri,
      method: "logMessage",
      args
    });
  }
}

/// Imported Modules END ///
