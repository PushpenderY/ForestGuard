import {
  ArrowUpRight,
  Code,
  Camera,
  Briefcase,
  Mail,
  Trees,
} from "lucide-react";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/pushpender-yadav-74934a288/",
    icon: Briefcase,
  },
  {
    name: "GitHub",
    href: "https://github.com/PushpenderY",
    icon: Code,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/yadav._pushpender?igsh=YjJ3d3h2ZmUxM256",
    icon: Camera,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#040d08]">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 -top-50 h-100 w-150 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">

        {/* Main footer */}
        <div className="grid gap-12 py-16 md:grid-cols-[1.3fr_0.7fr] md:py-20">

          {/* Brand */}
          <div>

            <a
              href="#home"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400">
                <Trees
                  size={22}
                  className="text-black"
                />
              </div>

              <div>
                <p className="text-xl font-bold text-white">
                  Forest<span className="text-emerald-400">Guard</span>
                </p>

                <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                  Forest Fire Intelligence
                </p>
              </div>
            </a>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/40">
              ForestGuard is a wildfire awareness and risk prediction
              platform designed to explore environmental conditions,
              wildfire activity and disaster preparedness.
            </p>

            <div className="mt-7 flex items-center gap-3 text-sm text-white/40">
            <a href="mailto:pushpender200406@gmail.com"
            className="mt-7 flex items-center gap-2 text-sm text-white/40 transition hover:text-emerald-400">
              <Mail size={16} className="text-emerald-400" />
              <span>Connect with Pushpender</span>
            </a>
              
            </div>

          </div>

          {/* Creator */}
          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
              Built by
            </p>

            <h3 className="mt-3 text-2xl font-bold text-white">
              Pushpender
              <span className="text-emerald-400"> Yadav</span>
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Developer • Builder • Engineering Student
            </p>

            {/* Social links */}
            <div className="mt-7 flex flex-wrap gap-3">

              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white/60 transition hover:border-emerald-400/20 hover:bg-emerald-400/5 hover:text-white"
                  >
                    <Icon
                      size={16}
                      className="transition group-hover:text-emerald-400"
                    />

                    {social.name}

                    <ArrowUpRight
                      size={13}
                      className="text-white/20 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400"
                    />
                  </a>
                );
              })}

            </div>

          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 py-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} ForestGuard. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="#home"
              className="transition hover:text-white"
            >
              Back to top
            </a>

            <span className="text-white/10">•</span>

            <span>
              Designed & built by Pushpender
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}