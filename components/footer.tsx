import Link from "next/link"
import { Github, Twitter, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#0b0b0b] border-t border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">CL</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">CashLabs <span className="text-green-500">FLOW</span></span>
            </Link>
            <p className="text-slate-400 max-w-md">
              A visual platform for developers to design, build, and deploy smart contracts and transactions on the
              Bitcoin Cash blockchain using CashScript.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/build/transactions" className="text-slate-400 hover:text-green-400 transition-colors">
                  Transaction Builder
                </Link>
              </li>
              <li>
                <Link href="/build/contracts" className="text-slate-400 hover:text-green-400 transition-colors">
                  Contract Builder (Pro)
                </Link>
              </li>
              <li>
                <Link href="/build/contracts/noob" className="text-slate-400 hover:text-green-400 transition-colors">
                  Easy Mode
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/cashlabs"
                target="_blank"
                className="text-slate-400 hover:text-green-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/cashlabs"
                target="_blank"
                className="text-slate-400 hover:text-green-400 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="mailto:hello@cashlabs.io" className="text-slate-400 hover:text-green-400 transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400 text-sm">© 2026 CashLabs FLOW. Powered by <a href="https://bitcoincash.org" className="text-green-500 hover:underline">Bitcoin Cash</a> and <a href="https://cashscript.org" className="text-green-500 hover:underline">CashScript</a>.</p>
        </div>
      </div>
    </footer>
  )
}
