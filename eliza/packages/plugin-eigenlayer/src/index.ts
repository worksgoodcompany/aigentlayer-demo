import type { Plugin } from "@ai16z/eliza";
import { factEvaluator } from "./evaluators/fact.ts";
import { goalEvaluator } from "./evaluators/goal.ts";
import { boredomProvider } from "./providers/boredom.ts";
import { factsProvider } from "./providers/facts.ts";
import { timeProvider } from "./providers/time.ts";
import eigenDepositAction from "./actions/eigendeposit";
import eigenQueueWithdrawalAction from "./actions/eigenqueuewithdrawal";
import eigenCompleteWithdrawalAction from "./actions/eigencompletewithdrawal";
import { tvlProvider } from './providers/tvl';
import { operatorProvider } from './providers/operator';
import { stakerProvider } from './providers/staker';

export * as actions from "./actions";
export * as evaluators from "./evaluators";
export * as providers from "./providers";

console.log("Registering EigenLayer actions:", {
    deposit: eigenDepositAction.name,
    queueWithdrawal: eigenQueueWithdrawalAction.name,
    completeWithdrawal: eigenCompleteWithdrawalAction.name
});

export const eigenlayerPlugin: Plugin = {
    name: "eigenlayer",
    description: "Agent EigenLayer with basic actions and evaluators",
    actions: [
        eigenDepositAction,
        eigenQueueWithdrawalAction,
        eigenCompleteWithdrawalAction
    ],
    evaluators: [factEvaluator, goalEvaluator],
    providers: [
        boredomProvider,
        timeProvider,
        factsProvider,
        tvlProvider,
        operatorProvider,
        stakerProvider
    ],
};
