import cohere from "cohere-ai";

import { env } from "@quenti/env/server";

let isInit = false;
if (env.COHERE_API_KEY) {
    cohere.init(env.COHERE_API_KEY);
    isInit = true;
}

const hasCohere = isInit;
export { cohere, hasCohere };
