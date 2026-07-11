"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "../component/Navbar";
import { useRouter } from "next/navigation";

// ── Policy content — a real sequence (account → bid → pay → ship → payout → disputes → law),
// so the timeline format and numbering actually carry information ──
const SECTIONS = [
  {
    no: "01",
    eyebrow: "Before you enter the floor",
    title: "Eligibility & your account",
    points: [
      "You must be 18 or older to bid, sell, or hold an account.",
      "Sellers connect a Stripe account at signup to receive payouts for completed sales.",
      "One account per person. Extra accounts used to inflate bids on your own listings will be closed.",
    ],
  },
  {
    no: "02",
    eyebrow: "Every bid counts",
    title: "Bidding & winning",
    points: [
      "A bid is a commitment, not a preview — winning means you owe payment.",
      "Bids can't be pulled back once placed, except for a clear listing error, reviewed case-by-case.",
      "The auction ends at the posted time. Highest bid standing at close wins the lot.",
    ],
  },
  {
    no: "03",
    eyebrow: "Closing the sale",
    title: "Buyer payment",
    points: [
      "Payment is due within 48 hours of winning, processed securely through Stripe.",
      "If you win but don't pay: no harm done to the seller — no fee is charged, and the lot simply moves on.",
      "Repeated unpaid wins may temporarily limit your ability to bid — genuine mistakes are fine, patterns aren't.",
    ],
  },
  {
    no: "04",
    eyebrow: "Once the gavel falls",
    title: "Seller shipping",
    points: [
      "All lots ship via FedEx within 5 to 10 business days of payment, with valid tracking — every time.",
      "Buyer and seller are each responsible for the shipping address and contact number on file being correct — Aucville does not verify or edit this information for either party.",
      "Lost, delayed, or misdelivered packages caused by an incorrect address or contact detail are not Aucville's responsibility — that risk sits with whichever party supplied the wrong information.",
      "Not shipping a paid order is treated seriously: expect account suspension pending review, and confirmed non-shipment can lead to legal action to recover the buyer's funds and damages.",
    ],
  },
  {
    no: "05",
    eyebrow: "What we keep, what you keep",
    title: "Fees & payout timing",
    points: [
      "Aucville takes a 7% fee on the final sale price from sellers — only on completed sales.",
      "Payout lands in your Stripe account 10–20 days after FedEx confirms delivery.",
      "Stripe's standard processing fees apply on top and are shown before you accept a payout.",
    ],
  },
  {
    no: "06",
    eyebrow: "Keeping the floor honest",
    title: "Prohibited items & disputes",
    points: [
      "No counterfeit, stolen, hazardous, or IP-infringing items — ever.",
      "Item not as described or never arrived? Open a dispute and our team steps in.",
      "False disputes filed in bad faith are treated the same as any other policy violation.",
    ],
  },
  {
    no: "07",
    eyebrow: "The fine print",
    title: "Liability & governing law",
    points: [
      "Aucville facilitates the marketplace and the FedEx handoff — we're not the seller of record, the shipper, or FedEx, for any listing.",
      "Once a package is scanned in by FedEx with the address and contact details either party provided, Aucville's responsibility for that shipment ends.",
      "This agreement is governed by the laws of the United States ",
      "We may update this policy over time; continued use after changes means you accept them.",
    ],
  },
];

function TimelineEntry({ section, index }) {
  const isRight = index % 2 === 1;

  return (
    <div className={`tl-row${isRight ? " tl-row-right" : ""}`} id={`section-${section.no}`}>
      <motion.div
        className="tl-content"
        initial={{ opacity: 0, x: isRight ? 36 : -36 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.65, ease: [0.22, 0.68, 0, 1.05] }}
      >
        <span className="tl-ghost-no" aria-hidden="true">{section.no}</span>
        <div className="tl-eyebrow">
          <span className="tl-sep" />
          <span className="tl-eyebrow-text">{section.eyebrow}</span>
        </div>
        <h3 className="tl-title">{section.title}</h3>
        <ul className="tl-points">
          {section.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </motion.div>

      <div className="tl-spine-slot">
        <motion.span
          className="tl-dot"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1.4, 0.36, 1] }}
        />
      </div>

      <div className="tl-content tl-content-empty" aria-hidden="true" />
    </div>
  );
}

export default function PolicyPage() {
  const [agreed, setAgreed] = useState(false);
  const heroRef = useRef(null);
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,400&family=Inter:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(0.8); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .policy-page {
          background: #ffffff;
          font-family: 'Inter', 'Helvetica Neue', sans-serif;
          min-height: 100vh;
        }

        .accent-bar {
          height: 3px;
          background: linear-gradient(90deg, #0f4527 0%, #1a7a48 50%, #52B788 100%);
          background-size: 200% 100%;
          animation: shimmer 6s linear infinite;
        }

        .live-dot {
          width: 6px; height: 6px;
          background: #1a7a48; border-radius: 50%; flex-shrink: 0;
          animation: pulse 1.5s ease-in-out infinite;
          display: inline-block;
        }

        /* ── Hero banner ── */
        .policy-hero {
          max-width: 780px; margin: 0 auto;
          padding: clamp(48px, 8vw, 88px) clamp(20px, 5vw, 48px) clamp(28px, 5vw, 48px);
          text-align: center;
        }
        .policy-eyebrow-top {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; color: #5c6b62; font-weight: 500;
          letter-spacing: 1.4px; text-transform: uppercase;
          margin-bottom: 20px;
        }
        h1.policy-h1 {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 400; color: #0a1f14;
          line-height: 1.14; letter-spacing: -0.4px;
          margin-bottom: 16px;
        }
        h1.policy-h1 em { font-style: italic; color: #1a7a48; }
        .policy-subtext {
          font-size: 15px; color: #3d5246;
          line-height: 1.75; max-width: 480px; margin: 0 auto;
        }

        /* ── Sticky section nav ── */
        .policy-nav-wrap {
          position: sticky; top: 0; z-index: 10;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(10px) saturate(160%);
          -webkit-backdrop-filter: blur(10px) saturate(160%);
          border-bottom: 1px solid #e3ece7;
        }
        .policy-nav {
          max-width: 1040px; margin: 0 auto;
          display: flex; gap: 6px; overflow-x: auto;
          padding: 12px clamp(20px, 5vw, 48px);
          scrollbar-width: none;
        }
        .policy-nav::-webkit-scrollbar { display: none; }
        .policy-nav a {
          flex-shrink: 0;
          font-size: 12px; font-weight: 500; color: #3d5246;
          text-decoration: none;
          background: rgba(26,122,72,0.06);
          border: 1px solid #d8e6de;
          border-radius: 20px; padding: 6px 13px;
          transition: background .15s, border-color .15s, color .15s;
          white-space: nowrap;
        }
        .policy-nav a:hover { background: #fff; border-color: #1a7a48; color: #0f4527; }

        /* ── Timeline ── */
        .tl-wrap {
          max-width: 980px; margin: 0 auto;
          padding: clamp(48px, 7vw, 72px) clamp(20px, 5vw, 48px) 0;
          position: relative;
        }

        /* central spine line, drawn behind everything */
        .tl-wrap::before {
          content: '';
          position: absolute;
          top: 0; bottom: 0; left: 50%;
          width: 1px;
          background: linear-gradient(180deg, transparent 0%, #cfe2d8 6%, #cfe2d8 94%, transparent 100%);
          transform: translateX(-50%);
        }

        .tl-row {
          display: grid;
          grid-template-columns: 1fr 56px 1fr;
          align-items: start;
          margin-bottom: clamp(36px, 6vw, 56px);
        }

        .tl-content {
          padding: 2px clamp(20px, 3vw, 40px) 2px 0;
          text-align: right;
          position: relative;
        }
        .tl-row-right .tl-content:first-child {
          grid-column: 3;
          text-align: left;
          padding: 2px 0 2px clamp(20px, 3vw, 40px);
        }
        .tl-row-right .tl-content-empty {
          grid-column: 1;
        }
        .tl-content-empty { visibility: hidden; }

        .tl-spine-slot {
          grid-column: 2;
          display: flex; justify-content: center;
          padding-top: 4px;
        }
        .tl-dot {
          width: 11px; height: 11px; border-radius: 50%;
          background: #ffffff;
          border: 2.5px solid #1a7a48;
          box-shadow: 0 0 0 5px #ffffff;
          display: block;
        }

        .tl-ghost-no {
          display: block;
          font-family: 'Fraunces', Georgia, serif;
          font-style: italic;
          font-size: clamp(36px, 5vw, 52px);
          color: #eaf2ed;
          line-height: 1;
          margin-bottom: -6px;
          user-select: none;
        }

        .tl-eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; justify-content: flex-end; }
        .tl-row-right .tl-content:first-child .tl-eyebrow { justify-content: flex-start; }

        .tl-sep { width: 18px; height: 1px; background: #1a7a48; flex-shrink: 0; }
        .tl-eyebrow-text {
          font-size: 10.5px; color: #5c6b62; font-weight: 600;
          letter-spacing: 1.2px; text-transform: uppercase;
        }

        .tl-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(19px, 2.2vw, 23px); font-weight: 500; color: #0a1f14;
          margin-bottom: 12px; letter-spacing: -0.2px;
        }

        .tl-points { list-style: none; display: flex; flex-direction: column; gap: 9px; }
        .tl-points li {
          font-size: 13.5px; color: #3d5246; line-height: 1.65;
        }

        @media (max-width: 760px) {
          .tl-wrap::before { left: 20px; }
          .tl-row, .tl-row-right {
            grid-template-columns: 40px 1fr;
          }
          .tl-spine-slot { grid-column: 1; padding-top: 4px; }
          .tl-content, .tl-row-right .tl-content:first-child {
            grid-column: 2 !important;
            text-align: left !important;
            padding: 2px 0 2px 18px !important;
          }
          .tl-content-empty, .tl-row-right .tl-content-empty { display: none; }
          .tl-eyebrow, .tl-row-right .tl-content:first-child .tl-eyebrow {
            justify-content: flex-start !important;
          }
          .tl-ghost-no { font-size: 32px; }
        }

        /* ── Agreement footer ── */
        .policy-footer {
          max-width: 640px; margin: 0 auto;
          padding: clamp(48px, 8vw, 72px) clamp(20px, 5vw, 48px) clamp(64px, 8vw, 96px);
          text-align: center;
        }
        .policy-footer-card {
          background: #f6faf7;
          border: 1px solid #d8e6de;
          border-radius: 20px;
          padding: 32px 28px;
        }
        .policy-footer-title {
          font-family: 'Fraunces', Georgia, serif; font-size: 22px;
          color: #0a1f14; margin-bottom: 10px; font-weight: 500;
        }
        .policy-footer-text { font-size: 13.5px; color: #3d5246; line-height: 1.7; margin-bottom: 20px; }

        .agree-row {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-bottom: 20px; font-size: 13px; color: #0a1f14;
        }
        .agree-row input {
          width: 16px; height: 16px; accent-color: #145c35; cursor: pointer;
        }

        .policy-cta {
          background: #145c35; color: #fff; border: none;
          border-radius: 999px; padding: 12px 30px;
          font-size: 13.5px; font-weight: 600; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: background .2s, transform .15s, opacity .2s;
        }
        .policy-cta:hover:not(:disabled) { background: #0f4527; }
        .policy-cta:active:not(:disabled) { transform: scale(0.97); }
        .policy-cta:disabled { opacity: 0.4; cursor: not-allowed; }

        @media (prefers-reduced-motion: reduce) {
          .accent-bar, .live-dot { animation: none; }
        }
      `}</style>
      <Navbar/>
      <div className="policy-page" ref={heroRef}>

        <div className="accent-bar" />

        <div className="policy-hero">
          <div className="policy-eyebrow-top"><span className="live-dot" />Read before you sign up</div>
          <h1 className="policy-h1">
            The rules of<br /><em>Aucville</em>
          </h1>
          <p className="policy-subtext">
            Seven short sections covering how bidding, FedEx shipping, and getting paid
            actually work on Aucville — for buyers and sellers alike.
          </p>
        </div>

        <div className="policy-nav-wrap">
          <nav className="policy-nav">
            {SECTIONS.map((s) => (
              <a key={s.no} href={`#section-${s.no}`}>{s.no} {s.title}</a>
            ))}
          </nav>
        </div>

        <div className="tl-wrap">
          {SECTIONS.map((s, i) => (
            <TimelineEntry key={s.no} section={s} index={i} />
          ))}
        </div>

        <div className="policy-footer">
          <motion.div
            className="policy-footer-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="policy-footer-title">One thing before you go</div>
            <p className="policy-footer-text">
              Creating an account means you accept all seven sections above —
              including FedEx shipping via the address and contact info you provide,
              the 7% seller fee, and the 10–20 day payout window.
            </p>
            <label className="agree-row">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              I've read and agree to Aucville's policy
            </label>
            <button className="policy-cta" disabled={!agreed} onClick={()=> router.push("/signup")}>
              Agree &amp; continue
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}