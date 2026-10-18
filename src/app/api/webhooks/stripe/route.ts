export async function POST(req: Request) {
  const raw = await req.text();
  return Response.json({ received: true, bytes: raw.length });
}
