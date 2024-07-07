"use server";

import { Order } from "@prisma/client";
import db from "@/lib/db";
import getSession from "@/lib/get-session";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
interface CreateCheckoutSessionProps {
  configId: string;
  shippingInfo: {
    contact: string;
    country: string;
    name: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zipcode: string;
  };
}

const CreateCheckoutSession = async ({
  configId,
  shippingInfo,
}: CreateCheckoutSessionProps) => {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("No such configuration found");
  }

  const session = await getSession();
  const user = session?.user;

  const { name, country, state, zipcode, city, contact, address, apartment } =
    shippingInfo;

  if (!user) {
    throw new Error("You need to be logged in");
  }

  const { finish, material } = configuration;

  let price = BASE_PRICE;
  if (finish === "textured") price += PRODUCT_PRICES.finish.textured;
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;

  let order: Order | undefined = undefined;

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  });

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        amount: price / 100,
        userId: user.id!,
        configurationId: configuration.id,
      },
    });
  }

  const fields = {
    email: user.email,
    amount: price * 100,
    metadata: {
      userId: user.id,
      orderId: order.id,
      phone: contact,
      name: name,
      country: country,
      state: state,
      city: city,
      address: address,
      apartment: apartment,
      zipcode: zipcode,
      product: {
        price: price,
        quantity: 1,
      },
      cancel_action: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?id=${configuration.id}`,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?orderId=${order.id}`,
    },
  };

  const url = "https://api.paystack.co/transaction/initialize";

  const paystackResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
    body: JSON.stringify(fields),
  });

  if (!paystackResponse.ok) {
    throw new Error(`Paystack API returned status ${paystackResponse.status}`);
  }

  const paystackResult = await paystackResponse.json();

  return { url: JSON.stringify(paystackResult) };
};

export default CreateCheckoutSession;
