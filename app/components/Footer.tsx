import Link from "next/link";

interface FooterProps {
  message?: string;
}

function Footer({ message }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
          <span className="text-sm font-semibold text-slate-900">Tulia</span>
          {message && <p className="text-xs text-slate-500">{message}</p>}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/privacy" className="transition hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="transition hover:text-slate-900">Terms</Link>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
