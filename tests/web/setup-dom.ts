import { GlobalRegistrator } from "@happy-dom/global-registrator";

import { envVariables } from "@/api/config/env";

GlobalRegistrator.register({ url: `http://localhost:${envVariables.PORT}` });
