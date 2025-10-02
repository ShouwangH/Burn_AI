import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { getPlan } from "../src/db/db"
import type { Route } from "./+types/burns";

export async function loader({ params }: LoaderFunctionArgs) {
    const place = params.place!;
    const [plan] = await getPlan(place);

    if (!plan) {
        throw new Response("Not found", { status: 404 });
    }

    return {plan:plan};
}

export default function Burns({ loaderData}:Route.ComponentProps) {


    if (loaderData.plan.status === "pending") {
        return <p>Generating documentary for {loaderData.plan.place}...</p>;
    }

    return (
        <div>
            <h2>Documentary for {loaderData.plan.place}</h2>
            <pre>{JSON.stringify(loaderData.plan.planJson, null, 2)}</pre>
        </div>
    );
}
