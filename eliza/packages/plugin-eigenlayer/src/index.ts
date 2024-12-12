import { Plugin } from "@ai16z/eliza";
import { factEvaluator } from "./evaluators/fact.ts";
import { goalEvaluator } from "./evaluators/goal.ts";
import { boredomProvider } from "./providers/boredom.ts";
import { factsProvider } from "./providers/facts.ts";
import { timeProvider } from "./providers/time.ts";
import eigenDepositAction from "./actions/eigendeposit";
import { eigenexplorerProvider } from "./providers/eigenexplorer.ts";
export * as actions from "./actions";
export * as evaluators from "./evaluators";
export * as providers from "./providers";

export const eigenlayerPlugin: Plugin = {
    name: "eigenlayer",
    description: "Agent EigenLayer with basic actions and evaluators",
    actions: [eigenDepositAction],
    evaluators: [factEvaluator, goalEvaluator],
    providers: [boredomProvider, timeProvider, factsProvider, eigenexplorerProvider],
};
