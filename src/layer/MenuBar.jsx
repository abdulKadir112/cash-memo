import React, { useState } from "react";
import { Link } from "react-router-dom";

const MenuBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.left}>
          <div
            className="hamburger"
            style={styles.menuIcon}
            onClick={() => setOpen(true)}
          >
            ☰
          </div>

          <div style={styles.logo}>My Shop</div>
        </div>

        <ul className="desktop-menu" style={styles.desktopMenu}>
          <li><Link style={styles.link} to="/">হোম</Link></li>
          <li><Link style={styles.link} to="/products">প্রোডাক্ট</Link></li>
          <li><Link style={styles.link} to="/customer">কাস্টমার</Link></li>
          <li><Link style={styles.link} to="/bill">বিল</Link></li>
          <li><Link style={styles.link} to="/report">রিপোর্ট</Link></li>
          <li><Link style={styles.link} to="/settings">সেটিংস</Link></li>
        </ul>
      </nav>

      {/* মোবাইল সাইডবার */}
      <div
        style={{
          ...styles.sidebar,
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div style={styles.close} onClick={() => setOpen(false)}>✕</div>

        <Link style={styles.sideLink} to="/" onClick={() => setOpen(false)}>হোম</Link>
        <Link style={styles.sideLink} to="/products" onClick={() => setOpen(false)}>প্রোডাক্ট</Link>
        <Link style={styles.sideLink} to="/customer" onClick={() => setOpen(false)}>কাস্টমার</Link>
        <Link style={styles.sideLink} to="/bill" onClick={() => setOpen(false)}>বিল</Link>
        <Link style={styles.sideLink} to="/report" onClick={() => setOpen(false)}>রিপোর্ট</Link>
        <Link style={styles.sideLink} to="/settings" onClick={() => setOpen(false)}>সেটিংস</Link>
      </div>

      {open && <div style={styles.overlay} onClick={() => setOpen(false)} />}
    </>
  );
};

const styles = {
  nav: {
    display: "flex",                  // ← এটা ঠিক করা হয়েছে (block → flex)
    justifyContent: "space-between",
    alignItems: "center",
    background: "#0f172a",
    padding: "12px 16px",             // ← একটু কম padding দিলাম
    color: "white",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)", // optional: সুন্দর ছায়া
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px",                      // ← হ্যামবার্গার আর লোগোর মাঝে জায়গা কমানো
  },

  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },

  menuIcon: {
    fontSize: "28px",
    cursor: "pointer",
    userSelect: "none",
    paddingRight: "6px",              // ← হ্যামবার্গারকে একটু ডানে সরানো
  },

  desktopMenu: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
    gap: "28px",                      // ← ডেস্কটপ লিঙ্কগুলোর মাঝে একটু বেশি জায়গা
  },

  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "16px",
  },

  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "260px",
    height: "100%",
    background: "#111827",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    transition: "transform 0.3s ease",
    zIndex: 1000,
  },

  sideLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    padding: "10px 12px",
    borderRadius: "6px",
    transition: "background 0.2s",
  },

  close: {
    fontSize: "32px",
    cursor: "pointer",
    alignSelf: "flex-end",
    marginBottom: "20px",
    color: "white",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
};

// Media Queries (আগের মতোই রাখা আছে — ভালো কাজ করে)
const globalStyles = `
  @media (max-width: 767px) {
    .desktop-menu {
      display: none !important;
    }
    .hamburger {
      display: block !important;
    }
  }

  @media (min-width: 768px) {
    .hamburger {
      display: none !important;
    }
    .desktop-menu {
      display: flex !important;
    }
  }
`;

// একবারই inject করা হবে (App.js / index.js এ রাখতে পারো)
if (typeof document !== "undefined" && !document.getElementById("menubar-styles")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "menubar-styles";
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}

export default MenuBar;