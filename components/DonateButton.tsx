"use client";

import { Check, Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function DonateButton() {
  const [donation, setDonation] = useState<{
    amount: number;
    donated: boolean;
  } | null>(null);

  useEffect(() => {
    const savedDonation = localStorage.getItem(
      "forestguard_donation"
    );

    if (savedDonation) {
      try {
        // Restore the persisted donation badge after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDonation(JSON.parse(savedDonation));
      } catch {
        localStorage.removeItem("forestguard_donation");
      }
    }
  }, []);

  if (donation?.donated) {
    return (
      <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400 px-5 py-3 text-sm font-bold text-black shadow-[0_10px_40px_rgba(16,185,129,0.2)]">
        <Check size={17} />

        Thanks for choosing ₹{donation.amount}
      </div>
    );
  }

  return (
    <a
      href="/donate"
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400 px-5 py-3 text-sm font-bold text-black shadow-[0_10px_40px_rgba(16,185,129,0.2)] transition hover:-translate-y-1 hover:bg-emerald-300"
    >
      <Heart
        size={17}
        className="fill-black"
      />

      Donate
    </a>
  );
}
