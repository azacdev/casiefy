import { Suspense } from "react";
import ThankYou from "./_components/thank-you";

const ThankYouPage = () => {
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  );
};

export default ThankYouPage;
