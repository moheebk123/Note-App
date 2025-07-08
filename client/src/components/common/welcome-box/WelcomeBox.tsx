import { useMemo } from "react";

const WelcomeBox = ({ name, email }: { name: string; email: string }) => {
  const maskedEmail = useMemo(() => {
    const [localPart, domain] = email.split("@");

    const maskedLocal = localPart.replace(/./g, "x");
    const [domainName, ...domainParts] = domain.split(".");
    const maskedDomain =
      domainName.replace(/./g, "x") + "." + domainParts.join(".");

    return `${maskedLocal}@${maskedDomain}`;
  }, [email]);

  return (
    <section className="py-8 px-4 mt-10 box-shadow flex flex-col gap-3 w-full md:w-fit h-fit border border-gray-200 rounded-xl">
      <h2 className="font-bold text-3xl md:text-5xl">Welcome, {name} !</h2>
      <p className="text-gray-600 text-xl md:text-2xl">Email: {maskedEmail}</p>
    </section>
  );
};

export default WelcomeBox;
