import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Resend } from "resend";
import OrderReceivedEmail from "@/components/emails/order-received-email";
const crypto = require("crypto");

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const headers = req.headers;
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const metadata = body.data.metadata;

    console.log(body.data.customer);

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

          const { email } = body.data.customer;

          if (!userId || !orderId) {
            throw new Error("Invalid request metadata");
          }

          const updatedOrder = await db.order.update({
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

          await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Thanks for your order!",
            react: OrderReceivedEmail({
              orderId,
              orderDate: updatedOrder.createdAt.toLocaleDateString(),
              // @ts-ignore
              shippingAddress: {
                name: name!,
                city: city!,
                country: country,
                postalCode: zipcode,
                street: address,
                state: state,
                phoneNumber: phone,
              },
            }),
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
