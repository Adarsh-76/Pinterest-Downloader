import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedBackground from '../ui/AnimatedBackground';

export default function Layout({ children }) {
  return (
    <div className="main-layout">
      <AnimatedBackground />
      <Navbar />
      <main className="page-content fade-in-up">
        {children}
      </main>
      <Footer />
    </div>
  );
}
