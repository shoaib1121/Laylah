import { useState } from 'react'
import './App.css'
const menuItems = [
  {
    id: 1,
    name: 'Chicken Dum Biryani',
    category: 'Indian',
    description: 'Fragrant basmati rice layered with slow-cooked spices.',
    price: 249,
  },
  {
    id: 2,
    name: 'Mutton Dum Biryani',
    category: 'Indian',
    description: 'Tender mutton, aromatic rice, and rich traditional spices.',
    price: 349,
  },
  {
    id: 3,
    name: 'Chicken Mandi',
    category: 'Arabian',
    description: 'Smoky roasted chicken served with fragrant mandi rice.',
    price: 299,
  },
  {
    id: 4,
    name: 'Chicken Grill',
    category: 'Arabian',
    description: 'Grilled chicken seasoned with bold Arabian spices.',
    price: 279,
  },
  {
    id: 5,
    name: 'Mint Lime',
    category: 'Drinks',
    description: 'A refreshing lime drink with a hint of mint.',
    price: 79,
  },
]
function App() {const [selectedCategory, setSelectedCategory] = useState('All')

const filteredItems =
  selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(
        (item) => item.category === selectedCategory
      )
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

        <div className="menu-filters">
  {['All', 'Indian', 'Arabian', 'Drinks'].map((category) => (
    <button
      key={category}
      type="button"
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