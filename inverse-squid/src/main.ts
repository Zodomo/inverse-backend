import { TypeormDatabase } from "@subsquid/typeorm-store";
import { processor, CONTRACT_ADDRESS } from "./processor";
import * as inverse from "./abi/inverse";

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      if (
        log.address === CONTRACT_ADDRESS &&
        log.topics[0] === inverse.events.Transfer.topic
      ) {
        let { from, to, id } = inverse.events.Transfer.decode(log);
        ctx.log.info(`Parsed a Transfer of token ${id} from ${from} to ${to}`);
      }
    }
  }
});
