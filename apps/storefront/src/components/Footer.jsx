import { Link } from "react-router-dom";

const columns = [
  {
    title: "Products",
    links: [
      "Aero Flagship",
      "Echo Earbuds",
      "Pulse Gaming",
      "Nova Studio",
      "Aurora ANC",
      "Accessories"
    ]
  },
  {
    title: "Stories",
    links: [
      "Veltr Sessions",
      "Artist Editions",
      "Sound Science",
      "Design Language",
      "Crafted Materials",
      "Journeys"
    ]
  },
  {
    title: "Support",
    links: [
      "Shipping & Delivery",
      "Returns",
      "Product Care",
      "Specs & Downloads",
      "Warranty",
      "FAQs"
    ]
  },
  {
    title: "Company",
    links: [
      "About Veltr",
      "Sustainability",
      "Retail Locations",
      "Careers",
      "Press Kits",
      "Investor Relations"
    ]
  },
  {
    title: "Connect",
    links: [
      "Contact",
      "Become a Partner",
      "Newsletter",
      "Gift Cards",
      "Corporate Sales",
      "Developer APIs"
    ]
  }
];

const legalLinks = [
  "Privacy Policy",
  "Terms of Use",
  "Sales & Refunds",
  "Legal",
  "Site Map"
];

export default function Footer() {
  return (
    <footer className="veltr-footer">
      <div className="v-container veltr-footer__inner">
        <div className="veltr-footer__disclaimer">
          Future-ready audio, obsessively tuned for every moment. Veltr is designed to disappear while the
          listening experience rises.
        </div>
        <div className="veltr-footer__grid">
          {columns.map((column) => (
            <div key={column.title} className="veltr-footer__column">
              <p className="veltr-footer__heading">{column.title}</p>
              <ul>
                {column.links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="veltr-footer__link">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="veltr-footer__legal">
        <div className="v-container veltr-footer__legal-inner">
          <span>© 2026 VELTR. All rights reserved.</span>
          <div className="veltr-footer__legal-links">
            {legalLinks.map((link) => (
              <Link key={link} to="#" className="veltr-footer__link">
                {link}
              </Link>
            ))}
          </div>
          <span className="veltr-footer__region">United States</span>
        </div>
      </div>
    </footer>
  );
}
