import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="bg-black z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8 z-50"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt=""
            />
          </Link>
        </div>

        <div className="lg:flex lg:flex-1 lg:justify-end">
          <Link href="/vent">
            <Button variant="ghost">
              <span className="text-white">Launch App</span>
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
