"use client";

import { getPaymentStatus } from "@/actions/get-payment-status";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ThankYou = () => {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || "";

  const [transaction, setTransaction] = useState();

  useEffect(() => {
    if (reference) {
      // Fetch transaction details from your server or directly from Paystack
      fetch(`/api/transaction?reference=${reference}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          setTransaction(data);
          // Update the order status in your database if necessary
        });
    }
  }, [reference]);

  // console.log(transaction);

  // const orderId = "";

  // const { data } = useQuery({
  //   queryKey: ["get-payment-status"],
  //   queryFn: async () => await getPaymentStatus({ orderId }),
  //   retry: true,
  //   retryDelay: 500,
  // });

  //   if (data === undefined) {
  //     return (
  //       <div className="w-full mt-24 flex justify-center">
  //         <div className="flex flex-col items-center gap-2">
  //           <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
  //           <h3 className="font-semibold text-xl">Loading your order...</h3>
  //           <p>This wont take long.</p>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (data == false) {
  //     return (
  //       <div className="w-full mt-24 flex justify-center">
  //         <div className="flex flex-col items-center gap-2">
  //           <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
  //           <h3 className="font-semibold text-xl">Veryfying your payment...</h3>
  //           <p>This might take a moment.</p>
  //         </div>
  //       </div>
  //     );
  //   }

  //   const { configuration, billingAddress, shippingAddress, amount } = data;
  //   const { color } = configuration;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="text-base font-medium text-primary">Thank you!</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Your case is on the way!
          </h1>
          <p className="mt-2 text-base text-zinc-50">
            We&lsquo;ve received your order and are now processing it.
          </p>

          <div className="mt-12 text-sm font-medium">
            <p className="text-zinc-900">Order number</p>
            {/* <p className="mt-2 text-zinc-500">{orderId}</p> */}
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200">
          <div className="mt-10 flex flex-auto flex-col">
            <h4 className="font-semibold text-zinc-900">
              You made a great choice!
            </h4>
            <p className="mt-2 text-sm text-zinc-600">
              We at Casiefy believe that a phone case doesn&lsquo;t only need to
              look good, but also last you for the years to come. We offer a
              3-year print guaratee. If your case is&lsquo;nt of the highest
              quality, we&lsquo;ll replace it for free.
            </p>
          </div>
        </div>

        <div className="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl"></div>
      </div>
    </div>
  );
};

export default ThankYou;
