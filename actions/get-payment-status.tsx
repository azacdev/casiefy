"use server";

import getSession from "@/lib/get-session";
import db from "@/lib/db";

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const session = await getSession();
  const user = session?.user;

  if (!user?.id || !user?.email) {
    throw new Error("You need to be logged in to view this page.");
  }

  console.log(orderId);
  

  const order = await db.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      user: true,
    },
  });

  if (!order) throw new Error("This order does not exist.");

  if (order.isPaid) {
    return order;
  } else {
    return false;
  }
};
