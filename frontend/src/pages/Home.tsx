import Header from "../components/Header";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { MessageCircle, Users, Shield, Bell, Zap, Phone } from "lucide-react";

function Home() {
  return (
    <>
      <Header />
      <main className="chat-bg min-h-screen flex flex-col">

        {/* ─── HERO ────────────────────────────────────────── */}
        <section className="flex flex-col justify-center items-center min-h-screen px-6 text-center">
          <div className="max-w-2xl lg:max-w-4xl mx-auto">
            <p className="text-xs lg:text-sm font-semibold uppercase tracking-widest text-slate-500 mb-6 lg:mb-10">
              Private · Secure · Real-time
            </p>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold text-slate-100 leading-[1.1] mb-5 lg:mb-8">
              Connect with people<br />
              <span className="text-blue-400">who matter.</span>
            </h1>

            <p className="text-slate-500 text-base sm:text-lg lg:text-xl leading-relaxed mb-10 lg:mb-14 max-w-md lg:max-w-xl mx-auto">
              Chat, call, and grow your network — all in one private, beautifully crafted place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 lg:px-10 py-3 lg:py-4 rounded-full font-semibold text-sm lg:text-base transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="text-slate-400 hover:text-slate-200 border border-white/10 hover:border-white/20 px-8 lg:px-10 py-3 lg:py-4 rounded-full font-semibold text-sm lg:text-base transition-colors"
              >
                Sign In
              </Link>
            </div>

            <p className="text-xs lg:text-sm text-slate-600 mt-6 lg:mt-8">No ads. No tracking. Just people.</p>
          </div>
        </section>

        {/* ─── FEATURES ────────────────────────────────────── */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">Everything you need</h2>
              <p className="text-slate-500 text-base">Built for real connections, not just notifications.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  icon: <Users size={22} className="text-blue-400" />,
                  title: "Connections",
                  desc: "Send connection requests, discover people you may know, and grow your circle.",
                },
                {
                  icon: <MessageCircle size={22} className="text-blue-400" />,
                  title: "Real-time Chat",
                  desc: "Instant private messaging with everyone in your network.",
                },
                {
                  icon: <Phone size={22} className="text-blue-400" />,
                  title: "Audio Calls",
                  desc: "Peer-to-peer voice calls — no third-party servers, just you and them.",
                },
                {
                  icon: <Bell size={22} className="text-blue-400" />,
                  title: "Notifications",
                  desc: "Stay updated on connection requests and new messages instantly.",
                  badge: "Soon",
                },
                {
                  icon: <Zap size={22} className="text-blue-400" />,
                  title: "Rich Profiles",
                  desc: "Build your personal profile with experience, skills, and social links.",
                  badge: "Soon",
                },
                {
                  icon: <Shield size={22} className="text-blue-400" />,
                  title: "Private & Secure",
                  desc: "Your data stays yours. No ads, no tracking, no data selling — ever.",
                },
              ].map(({ icon, title, desc, badge }) => (
                <div
                  key={title}
                  className="glass-card rounded-2xl p-6 flex gap-4 items-start hover:border-blue-500/20 transition-colors"
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ background: "rgba(37,99,235,0.15)" }}
                  >
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
                      {badge && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/25">
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─────────────────────────────────────────── */}
        <section id="faq" className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-100 mb-3">Frequently Asked Questions</h2>
              <p className="text-slate-500 text-sm">Everything you need to know before joining.</p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                {
                  q: "How do I sign up for Social?",
                  a: "Click \"Get Started Free\" at the top, fill in your name, username, email, and password — and you're in.",
                },
                {
                  q: "Is my data secure on Social?",
                  a: "Yes. We use encryption and security protocols to keep your conversations and personal information private.",
                },
                {
                  q: "Can I use Social on multiple devices?",
                  a: "Absolutely. Social works seamlessly across your phone, tablet, and computer.",
                },
                {
                  q: "Can I make voice calls on Social?",
                  a: "Yes. Social supports peer-to-peer audio calls directly in the app — no plugins or downloads needed.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="glass-card rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-blue-400 mb-2">{q}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA BANNER ──────────────────────────────────── */}
        <section className="py-20 px-6">
          <div
            className="max-w-2xl mx-auto glass-card rounded-3xl p-12 text-center"
            style={{ boxShadow: "0 0 60px rgba(37,99,235,0.10)" }}
          >
            <h2 className="text-3xl font-bold text-slate-100 mb-3">Ready to connect?</h2>
            <p className="text-slate-500 text-sm mb-8">Join thousands of people already on Social.</p>
            <Link
              to="/signup"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-10 py-3.5 rounded-full font-semibold text-sm transition-colors"
              style={{ boxShadow: "0 0 24px rgba(37,99,235,0.40)" }}
            >
              Create Your Account
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

export default Home;
