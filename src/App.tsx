import Nav from "./components/Nav";
import Acknowledgement from "./components/Acknowledgement";
import Hero from "./components/Hero";
import SectionPlaceholder from "./components/SectionPlaceholder";
import Footer from "./components/Footer";
import { SECTION_ORDER } from "./sections";

/**
 * App shell (TASKS.md 1.1): skip link → nav → Acknowledgement of Country →
 * single <main> containing the hero and every canonical section (exact
 * production ids, exact ntlsn-order sequence) → footer.
 *
 * A11y is built in — no runtime patch scripts: real skip link (2.4.1), one
 * <main> landmark, <a href> anchors with accessible names (2.4.4/4.1.2).
 */
export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Nav />
      <Acknowledgement />
      <main id="main-content">
        <Hero />
        {SECTION_ORDER.filter((id) => id !== "hero").map((id) => (
          <SectionPlaceholder key={id} id={id} />
        ))}
      </main>
      <Footer />
    </>
  );
}
