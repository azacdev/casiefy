import Link from "next/link";
import db from "@/lib/db";
import { notFound } from "next/navigation";

import { cn, formatPrice } from "@/lib/utils";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import CheckoutForm from "@/components/forms/checkout-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Phone from "@/components/phone";
import { COLORS } from "@/validators/option-validators";
import getSession from "@/lib/get-session";

interface CheckOutPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const CheckoutPage = async ({ searchParams }: CheckOutPageProps) => {
  const { id } = searchParams;

  const session = await getSession();
  const user = session?.user;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }

  const { color, model, finish, material } = configuration;
  const tw = COLORS.find(({ value }) => value === color)?.tw;

  let totalPrice = BASE_PRICE;
  if (material === "polycarbonate") {
    totalPrice += PRODUCT_PRICES.material.polycarbonate;
  }

  if (finish === "textured") {
    totalPrice += PRODUCT_PRICES.finish.textured;
  }

  return (
    <main className="h-full mx-auto max-w-screen-xl px-2.5 md:px-12 py-8">
      <Link
        href={"/"}
        className="flex z-40 font-semibold text-primary py-4 mb-5 lg:py-0 md:px-8 md:hidden"
      >
        Casiefy{" "}
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="order-2 md:order-1 w-full h-full md:border-r border-gray-400 md:p-8">
          <Link
            href={"/"}
            className="md:flex z-40 font-semibold text-green-600 hidden"
          >
            Casiefy{" "}
          </Link>
          <Breadcrumb className="py-5 lg:py-10">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Information</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Shipping</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Payment</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <CheckoutForm id={id} name={user?.name!} />
        </div>

        <div className="md:sticky top-0 md:p-8 order-1 md:order-2">
          <div className="grid grid-cols-3 w-full">
            <div className="flex h-fit col-span-2 gap-2 justify-end">
              <Phone
                imgSrc={configuration.croppedImageUrl!}
                className={cn(`bg-${tw} w-20`)}
              />

              <div className="flex flex-col w-full space-y-2">
                <p className="text-sm">Material: {material}</p>
                <p className="text-sm">Finish: {finish}</p>
              </div>
            </div>

            <div className="col-span-1">
              <p className="text-gray-900 text-sm">
                {formatPrice(totalPrice / 100)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 py-10">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">Sub total</p>
              <p className="font-semibold text-gray-900">
                {formatPrice(totalPrice / 100)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">Shipping</p>
              <p className="font-semibold text-gray-900">Free</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">Total</p>
              <p className="font-semibold text-gray-900">
                {formatPrice(totalPrice / 100)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
