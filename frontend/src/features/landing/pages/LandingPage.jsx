import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCarAlt, FaShieldAlt, FaWarehouse } from 'react-icons/fa';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import styles from './LandingPage.module.css';

const featuredBrands = ['BMW', 'Mercedes-Benz', 'Porsche', 'Tesla', 'Lamborghini'];

const whyChooseUs = [
  {
    title: 'Premium Inventory',
    description: 'Curated high-end vehicles with polished presentation and detailed specifications.',
    icon: <FaCarAlt />,
  },
  {
    title: 'Secure Operations',
    description: 'Built with dependable workflows for admins, customers, and growing dealership teams.',
    icon: <FaShieldAlt />,
  },
  {
    title: 'Smart Management',
    description: 'Track stock, arrivals, and merchandising in a clean, modern control center.',
    icon: <FaWarehouse />,
  },
];

const inventoryPreview = [
  {
    name: 'Aston Martin DB12',
    price: '$185,000',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Porsche Taycan',
    price: '$112,000',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'BMW X7',
    price: '$98,500',
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80',
  },
];

function LandingPage() {
  return (
    <div className={styles.pageShell}>
      <header className={styles.topBar}>
        <Link to="/" className={styles.brandMark}>
          <span className={styles.brandIcon}>◈</span>
          <span>Prestige Motors</span>
        </Link>

        <nav className={styles.navLinks}>
          <a href="#inventory">Inventory</a>
          <a href="#why-us">Why Us</a>
          <a href="#brands">Brands</a>
        </nav>
      </header>

      <main>
        <section className={styles.heroSection}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.heroContent}
          >
            <p className={styles.eyebrow}>Luxury Automotive Platform</p>
            <h1>Premium Car Dealership Inventory</h1>
            <p className={styles.heroText}>
              A modern, elegant inventory experience crafted for premium dealerships that want to present every vehicle beautifully.
            </p>

            <div className={styles.heroActions}>
              <Link to="/login" className={styles.primaryAction}>
                Login <FaArrowRight />
              </Link>
              <Link to="/register" className={styles.secondaryAction}>
                Register
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className={styles.heroVisual}
          >
            <img
              src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury sports car"
            />
          </motion.div>
        </section>

        <section id="brands" className={styles.brandStrip}>
          <p>Trusted by elite automotive brands</p>
          <div className={styles.brandList}>
            {featuredBrands.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
          </div>
        </section>

        <section id="why-us" className={styles.infoSection}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Why choose us</p>
            <h2>Crafted for modern dealer experiences</h2>
          </div>

          <div className={styles.featureGrid}>
            {whyChooseUs.map((item) => (
              <Card key={item.title} className={styles.featureCard} hoverable>
                <div className={styles.featureIcon}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="inventory" className={styles.inventorySection}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Inventory preview</p>
            <h2>Showcase your finest vehicles</h2>
          </div>

          <div className={styles.inventoryGrid}>
            {inventoryPreview.map((vehicle) => (
              <Card key={vehicle.name} className={styles.inventoryCard} hoverable>
                <img src={vehicle.image} alt={vehicle.name} />
                <div className={styles.inventoryBody}>
                  <h3>{vehicle.name}</h3>
                  <p>{vehicle.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Prestige Motors. Premium inventory, beautifully presented.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
