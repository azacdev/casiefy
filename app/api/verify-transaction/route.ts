import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const reference = searchParams.get("reference");

  if (!reference) {
    return new NextResponse("Transaction reference is missing", {
      status: 400,
    });
  }

  try {
    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      mode: "no-cors",
    });

    if (!response.ok) {
      console.log(response.status);
      throw new Error(`Paystack API returned status ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
