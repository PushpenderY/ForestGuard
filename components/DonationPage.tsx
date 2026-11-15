"use client";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";

import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DonationAmount = 9 | 99 | 999;

const donationOptions = [
  {
    amount: 9 as DonationAmount,
    title: "Small Spark",
    description:
      "A small contribution towards wildfire awareness and prevention.",
    features: [
      "Support awareness",
      "Help spread prevention",
      "Every contribution matters",
    ],
  },
  {
    amount: 99 as DonationAmount,
    title: "Forest Supporter",
    description:
      "Help support environmental awareness and wildfire preparedness.",
    features: [
      "Support wildfire awareness",
      "Promote forest protection",
      "Help communities prepare",
    ],
    popular: true,
  },
  {
    amount: 999 as DonationAmount,
    title: "Forest Guardian",
    description:
      "A meaningful contribution towards a safer and more resilient future.",
    features: [
      "Maximum impact",
      "Support conservation awareness",
      "Help build a safer future",
    ],
  },
];

export default function DonationPage() {
  const router = useRouter();

  const [selectedAmount, setSelectedAmount] =
    useState<DonationAmount | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const UPI_ID = "9571065400@ybl";
  const UPI_NAME = "Pushpender Yadav";

  const getUPILink = (amount: DonationAmount) => {
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
      UPI_NAME
    )}&am=${amount}&cu=INR`;
  };

  const handlePaymentCompleted = () => {
    if (!selectedAmount) return;

    // Remember the selected donation locally.
    localStorage.setItem(
      "forestguard_donation",
      JSON.stringify({
        amount: selectedAmount,
        donated: true,
      })
    );

    setSelectedAmount(null);
    setShowSuccess(true);

    // Show success message, then return home.
    setTimeout(() => {
      router.push("/");
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-[#040d08] text-white">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-250px] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[150px]" />

        <div className="absolute bottom-[-200px] left-[-150px] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to ForestGuard
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400">
              <Heart
                size={18}
                className="fill-black text-black"
              />
            </div>

            <span className="font-bold">
              Forest<span className="text-emerald-400">Guard</span>
            </span>
          </div>

        </div>
      </header>

      {/* Main */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2">
            <Sparkles
              size={15}
              className="text-emerald-400"
            />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Support ForestGuard
            </span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Every contribution
            <br />
            <span className="text-emerald-400">
              protects a little more.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/45 md:text-lg">
            Choose a contribution that feels right for you.
            Your support helps promote wildfire awareness,
            environmental education and prevention.
          </p>

        </div>

        {/* Cards */}
        <div className="mx-auto mt-16 grid max-w-6xl gap-5 lg:grid-cols-3">

          {donationOptions.map((option) => (
            <div
              key={option.amount}
              className={`relative flex flex-col rounded-3xl border p-7 transition duration-300 hover:-translate-y-2 ${
                option.popular
                  ? "border-emerald-400/40 bg-emerald-400/[0.06]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >

              {option.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-400 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-black">
                  Most Popular
                </div>
              )}

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  option.popular
                    ? "bg-emerald-400 text-black"
                    : "bg-white/5 text-emerald-400"
                }`}
              >
                <Heart
                  size={21}
                  className={option.popular ? "fill-black" : ""}
                />
              </div>

              <h2 className="mt-7 text-xl font-semibold">
                {option.title}
              </h2>

              <p className="mt-3 min-h-[72px] text-sm leading-6 text-white/40">
                {option.description}
              </p>

              <div className="mt-7">
                <span className="text-sm text-white/40">₹</span>

                <span className="ml-1 text-5xl font-bold tracking-tight">
                  {option.amount}
                </span>
              </div>

              <div className="mt-8 space-y-4">
                {option.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 rounded-full bg-emerald-400/10 p-1">
                      <Check
                        size={12}
                        className="text-emerald-400"
                      />
                    </div>

                    <span className="text-sm text-white/55">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedAmount(option.amount)}
                className={`mt-9 w-full rounded-xl px-5 py-3.5 text-sm font-semibold transition ${
                  option.popular
                    ? "bg-emerald-400 text-black hover:bg-emerald-300"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                Support with ₹{option.amount}
              </button>

            </div>
          ))}

        </div>

        {/* Trust */}
        <div className="mx-auto mt-12 flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-white/30">
            <ShieldCheck
              size={15}
              className="text-emerald-400"
            />
            Secure UPI payment
          </div>

          <span className="hidden text-white/10 sm:block">•</span>

          <p className="text-xs text-white/30">
            Select an amount and scan the generated QR code.
          </p>
        </div>

      </div>

      {/* QR MODAL */}
      {selectedAmount && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-6 backdrop-blur-md">

          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0b1d15] p-7 shadow-2xl">

            <button
              onClick={() => setSelectedAmount(null)}
              className="absolute right-5 top-5 rounded-xl border border-white/10 p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Close payment"
            >
              <X size={18} />
            </button>

            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                <Heart
                  size={22}
                  className="fill-emerald-400 text-emerald-400"
                />
              </div>

              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/30">
                Your contribution
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                ₹{selectedAmount}
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Scan the QR code using your UPI app.
              </p>

            </div>

            {/* QR */}
            <div className="mx-auto mt-8 flex w-fit rounded-2xl bg-white p-5">
              <QRCodeSVG
                value={getUPILink(selectedAmount)}
                size={220}
                level="H"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">

              <p className="text-[10px] uppercase tracking-wider text-white/30">
                Paying to
              </p>

              <p className="mt-1 font-medium">
                {UPI_NAME}
              </p>

              <p className="mt-1 break-all text-xs text-emerald-400/70">
                {UPI_ID}
              </p>

            </div>

            {/* Completed payment button */}
            <button
              onClick={handlePaymentCompleted}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-emerald-300"
            >
              <CheckCircle2 size={18} />
              I&apos;ve completed the payment
            </button>

            <p className="mt-4 text-center text-[11px] leading-5 text-white/25">
              Only select this after completing your payment in
              your UPI application.
            </p>

          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 px-6 backdrop-blur-lg">

          <div className="w-full max-w-md rounded-3xl border border-emerald-400/20 bg-[#0b1d15] p-8 text-center shadow-2xl">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/10">
              <CheckCircle2
                size={42}
                className="text-emerald-400"
              />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Thank you
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Contribution received
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/40">
              Thank you for supporting ForestGuard and helping
              spread awareness about wildfire prevention.
            </p>

            <div className="mt-7 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4">
              <p className="text-xs text-white/30">
                Redirecting you to ForestGuard...
              </p>
            </div>

          </div>

        </div>
      )}

    </main>
  );
}
