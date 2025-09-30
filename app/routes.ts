import { type RouteConfig, index } from "@react-router/dev/routes";
import {route} from '@react-router/dev/routes'

export default [index("routes/home.tsx"),
    route('api/auth/*', "routes/api.auth.$.ts"),
    route("chat","routes/chat.tsx"),
    route('ai','routes/ai.tsx')
] satisfies RouteConfig;
