import { Suspense } from "react";
import ThankYou from "./_components/thank-you";

interface ThankYouPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const ThankYouPage = async ({ searchParams }: ThankYouPageProps) => {
  const { reference } = searchParams;

  const response = await fetch(
    // `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-transaction?reference=${reference}`
    `http://localhost:3000/api/verify-transaction?reference=${reference}`
  );

  const data = await response.json();
  const transaction = data.data.metadata;

  return (
    <Suspense>
      <ThankYou transaction={transaction}/>
    </Suspense>
  );
};

export default ThankYouPage;
