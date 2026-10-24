import './App.css'

function App() {
  return (
    <main>
      <nav className="navbar">
        <a className="brand" href="#home">LAMP<span>.</span></a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu">Our Menu</a>
          <a href="#story">Our Story</a>
        </div>

        <a className="nav-cta" href="#menu">Explore Menu</a>
      </nav>

      <section className="hero-section" id="home">
        <div className="hero-content">
          <p className="eyebrow">INDIAN SOUL. ARABIAN SPIRIT.</p>

          <h1>
            Good food.<br />
            <span>Beautifully</span><br />
            brought together.
          </h1>

          <p className="hero-description">
            From fragrant biryanis to smoky grills, discover
            a table where Indian tradition meets Arabian warmth.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#menu">
              Discover our menu
            </a>
            <a className="text-link" href="#story">
              Our story →
            </a>
          </div>

          <p className="hero-note">MADE WITH CARE. SERVED WITH HEART.</p>
        </div>

        <div className="hero-visual" role="img" aria-label="Restaurant food presentation">
          <div className="image-placeholder">
            <span>AN EXPERIENCE WORTH SITTING DOWN FOR</span>
          </div>
          <div className="visual-caption">
            <span>THE LAMP TABLE</span>
            <span>GOOD FOOD, GOOD COMPANY</span>
          </div>
        </div>
      </section>

      <section className="menu-section" id="menu">
        <div>
          <p className="eyebrow">A TASTE OF LAMP</p>
          <h2>Made for the<br />moments that matter.</h2>
        </div>

        <p className="section-description">
          Comforting classics, bold spices, and flavours that
          bring people together. There's always room for one more.
        </p>

        <div className="menu-grid">
          <article className="menu-card">
            <span className="menu-number">01</span>
            <h3>Signature Biryanis</h3>
            <p>Fragrant rice, slow-cooked spices, unforgettable flavour.</p>
          </article>

          <article className="menu-card">
            <span className="menu-number">02</span>
            <h3>Arabian Grills</h3>
            <p>Smoky, savoury favourites made for sharing.</p>
          </article>

          <article className="menu-card">
            <span className="menu-number">03</span>
            <h3>From the Kitchen</h3>
            <p>Indian comfort food with a little Arabian inspiration.</p>
          </article>
        </div>
      </section>

      <section className="story-section" id="story">
        <p className="eyebrow">MORE THAN A MEAL</p>
        <h2>A little warmth.<br />A lot of flavour.</h2>
        <p>
          Lamp is built around a simple idea: great food tastes even
          better when it brings people closer. Come hungry, leave happy.
        </p>
        <a className="button button-light" href="#home">Back to the top ↑</a>
      </section>

      <footer className="footer">
        <a className="brand" href="#home">LAMP<span>.</span></a>
        <p>Good food brings us together.</p>
        <span>© 2026 Lamp. A concept in the making.</span>
      </footer>
    </main>
  )
}

export default App