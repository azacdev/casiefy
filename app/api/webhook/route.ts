import { NextResponse } from "next/server";
import db from "@/lib/db";
const crypto = require("crypto");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const headers = req.headers;
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const metadata = body.data.metadata;

    console.log(metadata);    

    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    const signature = headers.get("x-paystack-signature");

    if (hash !== signature) {
      const eventType = body.event;
      const chargeData = body.data;
      const status = chargeData.status;

      console.log(status);

      if (eventType === "charge.success") {
        if (status === "success") {
          const {
            userId,
            orderId,
            name,
            city,
            country,
            zipcode,
            address,
            state,
            phone,
          } = metadata || {
            userId: null,
            orderId: null,
          };

          if (!userId || !orderId) {
            throw new Error("Invalid request metadata");
          }

          await db.order.update({
            where: {
              id: orderId,
            },
            data: {
              isPaid: true,
              shippingAddress: {
                create: {
                  name: name!,
                  city: city!,
                  country: country,
                  postalCode: zipcode,
                  street: address,
                  state: state,
                  phoneNumber: phone,
                },
              },
              billingAddress: {
                create: {
                  name: name!,
                  city: city!,
                  country: country,
                  postalCode: zipcode,
                  street: address,
                  state: state,
                  phoneNumber: phone,
                },
              },
            },
          });

          console.log(
            `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?orderId=${orderId}`
          );

          return new NextResponse(null, {
            status: 302,
            headers: {
              Location: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?orderId=${orderId}`,
            },
          });
        } else {
          return NextResponse.json(
            { message: "Payment unsuccessful" },
            { status: 400 }
          );
        }
      }
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
