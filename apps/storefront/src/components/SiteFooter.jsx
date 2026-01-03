export default function SiteFooter() {
  const links = [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <footer className="site-footer">
      <div className="v-container site-footer__inner">
        <span>© 2026 VELTR. All rights reserved.</span>
        <div className="site-footer__links">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="site-footer__link">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
