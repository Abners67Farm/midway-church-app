import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Midway Baptist Church',
  description: 'A place to worship, grow, and connect.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site-wrapper">
          <Navbar />

          <main className="site-container">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}