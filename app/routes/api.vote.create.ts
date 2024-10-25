import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();

  const playlistId = form.get("playlistId");
  if (!playlistId || typeof playlistId !== "string") throw redirect("/");

  throw redirect("/vote/" + playlistId);
}
