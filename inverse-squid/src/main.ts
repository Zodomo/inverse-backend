import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Context, processor, CONTRACT_ADDRESS } from "./processor";
import * as inverse from "./abi/inverse";
import { Owner, Token, Transfer, GasStipend } from "./model";

interface RawTransfer {
  id: string;
  tokenId: bigint;
  from: string;
  to: string;
  timestamp: Date;
  blockNumber: number;
  txHash: string;
}

interface RawGasStipend {
  id: string;
  addr: string;
  amount: bigint;
  timestamp: Date;
  blockNumber: number;
  txHash: string;
}

function getRawTransfers(ctx: Context): RawTransfer[] {
  let transfers: RawTransfer[] = [];

  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      if (
        log.address === CONTRACT_ADDRESS &&
        log.topics[0] === inverse.events.Transfer.topic
      ) {
        let { from, to, tokenId } = inverse.events.Transfer.decode(log);
        transfers.push({
          id: log.id,
          tokenId,
          from,
          to,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          txHash: log.transactionHash,
        });
        ctx.log.info(
          `Parsed a Transfer of token ${tokenId} from ${from} to ${to}`
        );
      }
    }
  }

  return transfers;
}

function getRawGasStipends(ctx: Context): RawGasStipend[] {
  let gasStipends: RawGasStipend[] = [];

  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      if (
        log.address === CONTRACT_ADDRESS &&
        log.topics[0] === inverse.events.GasStipend.topic
      ) {
        let { addr, amount } = inverse.events.GasStipend.decode(log);
        gasStipends.push({
          id: log.id,
          addr,
          amount,
          timestamp: new Date(block.header.timestamp),
          blockNumber: block.header.height,
          txHash: log.transactionHash,
        });
        ctx.log.info(`Parsed a GasStipend of ${amount} to ${addr}`);
      }
    }
  }

  return gasStipends;
}

function createOwners(rawTransfers: RawTransfer[]): Map<string, Owner> {
  let owners: Map<string, Owner> = new Map();
  for (let t of rawTransfers) {
    owners.set(t.from, new Owner({ id: t.from }));
    owners.set(t.to, new Owner({ id: t.to }));
  }
  return owners;
}

function createTokens(
  rawTransfers: RawTransfer[],
  owners: Map<string, Owner>
): Map<string, Token> {
  let tokens: Map<string, Token> = new Map();
  for (let t of rawTransfers) {
    let tokenIdString = `${t.tokenId}`;
    tokens.set(
      tokenIdString,
      new Token({
        id: tokenIdString,
        tokenId: t.tokenId,
        owner: owners.get(t.to),
      })
    );
  }
  return tokens;
}

function createTransfers(
  rawTransfers: RawTransfer[],
  owners: Map<string, Owner>,
  tokens: Map<string, Token>
): Transfer[] {
  return rawTransfers.map(
    (t) =>
      new Transfer({
        id: t.id,
        token: tokens.get(`${t.tokenId}`),
        from: owners.get(t.from),
        to: owners.get(t.to),
        timestamp: t.timestamp,
        blockNumber: t.blockNumber,
        txHash: t.txHash,
      })
  );
}

function createGasStipends(rawGasStipends: RawGasStipend[]): GasStipend[] {
  return rawGasStipends.map(
    (gs) =>
      new GasStipend({
        id: gs.id,
        addr: gs.addr,
        amount: gs.amount,
        timestamp: gs.timestamp,
        blockNumber: gs.blockNumber,
        txHash: gs.txHash,
      })
  );
}

processor.run(new TypeormDatabase(), async (ctx) => {
  let rawTransfers: RawTransfer[] = getRawTransfers(ctx);
  let rawGasStipends: RawGasStipend[] = getRawGasStipends(ctx);

  let owners: Map<string, Owner> = createOwners(rawTransfers);
  let tokens: Map<string, Token> = createTokens(rawTransfers, owners);
  let transfers: Transfer[] = createTransfers(rawTransfers, owners, tokens);
  let gasStipends: GasStipend[] = createGasStipends(rawGasStipends);

  await ctx.store.upsert([...owners.values()]);
  await ctx.store.upsert([...tokens.values()]);
  await ctx.store.insert(transfers);
  await ctx.store.insert(gasStipends);
});
