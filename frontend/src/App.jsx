import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [menuItems, setMenuItems] = useState([])
  const [menuStatus, setMenuStatus] = useState('loading')

  useEffect(() => {
    fetch('/api/v1/menu')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Menu request failed')
        }

        return response.json()
      })
      .then((data) => {
        setMenuItems(data.items)
        setMenuStatus('success')
      })
      .catch(() => {
        setMenuStatus('error')
      })
  }, [])

  const filteredItems =
    selectedCategory === 'All'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory)

  return (
    <main>
      <nav className="navbar">
        <a className="brand" href="#home">LAYLAH<span>.</span></a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu">Our Menu</a>
          <a href="#story">Our Story</a>
        </div>

        <a className="nav-cta" href="#menu">Explore Menu</a>
      </nav>

      <section className="intro-section" id="home">
        <div className="intro-content">
          <p className="eyebrow">INDIAN SOUL. ARABIAN SPIRIT.</p>

          <h1>
            Good food.<br />
            <span>Beautifully</span><br />
            brought together.
          </h1>

          <p className="intro-description">
            From fragrant biryanis to smoky grills, discover
            a table where Indian tradition meets Arabian warmth.
          </p>

          <div className="intro-actions">
            <a className="button button-primary" href="#menu">
              Discover our menu
            </a>
            <a className="text-link" href="#story">
              Our story →
            </a>
          </div>

          <p className="intro-note">MADE WITH CARE. SERVED WITH HEART.</p>
        </div>

        <div className="intro-visual" role="img" aria-label="Temporary illustration of a Laylah dish">
          <div className="intro-placeholder" aria-hidden="true">
            <div className="intro-plate">
              <div className="intro-food" />
            </div>
            <span>TEMPORARY FOOD VISUAL · PHOTO TO COME</span>
          </div>
          <div className="visual-caption">
            <span>THE LAYLAH TABLE</span>
            <span>GOOD FOOD, GOOD COMPANY</span>
          </div>
        </div>
      </section>

      <section className="menu-section" id="menu">
        <div>
          <p className="eyebrow">A TASTE OF LAYLAH</p>
          <h2>Made for the<br />moments that matter.</h2>
        </div>

        <p className="section-description">
          Comforting classics, bold spices, and flavours that
          bring people together. There's always room for one more.
        </p>

        <div className="menu-filters">
  {['All', 'Indian', 'Arabian', 'Drinks'].map((category) => (
    <button
      key={category}
      type="button"
      aria-pressed={selectedCategory === category}
      className={
        selectedCategory === category
          ? 'menu-filter active'
          : 'menu-filter'
      }
      onClick={() => setSelectedCategory(category)}
    >
      {category}
    </button>
  ))}
</div>

        {menuStatus === 'loading' && <p>Loading menu…</p>}

        {menuStatus === 'error' && (
          <p role="alert">
            The menu could not be loaded. Please try again later.
          </p>
        )}

        {menuStatus === 'success' && (
          <>
            <p className="menu-result-count" aria-live="polite">
              Showing {filteredItems.length} dishes
            </p>

            <div className="menu-grid">
              {filteredItems.map((item) => (
                <article className="menu-card" key={item.id}>
                  <span className="menu-number">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p className="menu-price">₹{item.price}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="story-section" id="story">
        <p className="eyebrow">MORE THAN A MEAL</p>
        <h2>A little warmth.<br />A lot of flavour.</h2>
        <p>
          Laylah is built around a simple idea: great food tastes even
          better when it brings people closer. Come hungry, leave happy.
        </p>
        <a className="button button-light" href="#home">Back to the top ↑</a>
      </section>

      <footer className="footer">
        <a className="brand" href="#home">LAYLAH<span>.</span></a>
        <p>Good food brings us together.</p>
        <span>© 2026 Laylah. A concept in the making.</span>
      </footer>
    </main>
  )
}

export default App
