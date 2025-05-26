import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/dashboardPage.css";
import { BASE_URL } from "../utils";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [layanan, setLayanan] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 1234,
    activeServices: 0,
    todayAppointments: 48,
    averageRating: 4.8,
  });

  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Haqi Jamaludin",
      specialty: "Kardiologi",
      image: "/images/haqi.jpg",
      available: true,
    },
    {
      id: 2,
      name: "Dr. Fathahillah Chen",
      specialty: "Neurologi",
      image: "/images/dokter.png",
      available: true,
    },
  ]);

  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState("User");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const scrollToServices = () => {
    const servicesSection = document.getElementById("services-section");
    servicesSection.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${BASE_URL}/layanan`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLayanan(response.data);
      } catch (error) {
        console.error("Error fetching layanan:", error);
      }
    };

    fetchLayanan();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(res.data.role); // role dari /me
        setUsername(res.data.username || "User");
      } catch (err) {
        setUserRole(null);
        setUsername("User");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const header = document.querySelector(".dashboard-header");
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleadmin = () => {
    navigate("/admin");
    setDropdownOpen(false);
  };

  const handleHistory = () => {
    navigate("/history");
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/Profil");
    setDropdownOpen(false);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: "linear",
    pauseOnHover: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  const heroSlides = [
    {
      id: 1,
      category: "Healthcare",
      date: new Date().toLocaleDateString(),
      title: "Layanan Kesehatan Modern",
      description: "Solusi kesehatan terpercaya untuk Anda dan keluarga",
      image: "/images/banner1.jpg",
    },
    {
      id: 2,
      category: "Medical Services",
      date: new Date().toLocaleDateString(),
      title: "Tim Dokter Profesional",
      description: "Ditangani langsung oleh dokter berpengalaman",
      image: "/images/banner2.jpg",
    },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <span role="img" aria-label="logo" className="logo-icon">
              🩺
            </span>
            <span className="logo-text">MedCare</span>
          </div>

          <nav className="main-nav">
            <a href="#dashboard-main" className="nav-link">
              Home
            </a>
            <a href="#services-section" className="nav-link">
              Services
            </a>
            <a href="#doctors-section" className="nav-link">
              Doctors
            </a>
            <a href="#emergency-section" className="nav-link">
              Contact
            </a>
          </nav>

          <div className="profile-dropdown" ref={dropdownRef}>
            <div
              className="profile-trigger"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              <div className="profile-avatar-wrapper">
                <span className="profile-avatar">{username[0]}</span>
              </div>
              <span className="profile-name">{username}</span>
              <span className="profile-caret">&#9662;</span>
            </div>

            {dropdownOpen && (
              <div className="profile-menu">
                <button className="menu-item" onClick={handleProfile}>
                  <span role="img" aria-label="profile" className="menu-icon">
                    👤
                  </span>
                  <span className="menu-text">Profile</span>
                </button>
                <button className="menu-item" onClick={handleHistory}>
                  <span role="img" aria-label="history" className="menu-icon">
                    📜
                  </span>
                  <span className="menu-text">History</span>
                </button>
                {/* Tampilkan menu admin hanya jika role admin */}
                {userRole === "admin" && (
                  <button
                    className="menu-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/admin");
                    }}
                  >
                    <span role="img" aria-label="admin" className="menu-icon">
                      🛠️
                    </span>
                    <span className="menu-text">Admin</span>
                  </button>
                )}
                <button className="menu-item logout-btn" onClick={handleLogout}>
                  <span role="img" aria-label="logout" className="menu-icon">
                    🚪
                  </span>
                  <span className="menu-text">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="dashboard-main" id ="dashboard-main">
        <section className="hero-section">
          <Slider {...sliderSettings} className="hero-slider">
            {heroSlides.map((slide) => (
              <div key={slide.id} className="hero-slide">
                <div
                  className="slide-content"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="slide-overlay">
                    <div className="slide-text">
                      <div className="slide-meta">
                        <span className="meta-tag">{slide.category}</span>
                        <span className="meta-date">{slide.date}</span>
                      </div>
                      <h1 className="slide-title">{slide.title}</h1>
                      <p className="slide-description">{slide.description}</p>
                      <button
                        className="services-btn"
                        onClick={scrollToServices}
                      >
                        Lihat Layanan
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <section className="quick-stats">
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Total Pasien</h3>
                <p className="stat-number">
                  {stats.totalPatients.toLocaleString()}
                </p>
                <span className="stat-trend positive">
                  +12% dari bulan lalu
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏥</div>
              <div className="stat-content">
                <h3>Layanan Aktif</h3>
                <p className="stat-number">{layanan.length}</p>
                <span className="stat-label">Layanan tersedia</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>Jadwal Hari Ini</h3>
                <p className="stat-number">{stats.todayAppointments}</p>
                <span className="stat-label">Appointments</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>Rating</h3>
                <p className="stat-number">{stats.averageRating}</p>
                <span className="stat-label">Dari 500+ reviews</span>
              </div>
            </div>
          </div>
        </section>

        <section id="services-section" className="services-section">
          <div className="section-header">
            <span className="section-tag">Our Services</span>
            <h2 className="section-title">Layanan Medis Kami</h2>
            <p className="section-subtitle">
              Pilih layanan kesehatan sesuai kebutuhan Anda
            </p>
          </div>

          <div className="services-container">
            {layanan.length === 0 ? (
              <div className="no-services">
                <span className="empty-icon">📋</span>
                <p>Tidak ada layanan tersedia.</p>
              </div>
            ) : (
              <div className="services-row">
                {layanan.map((item) => (
                  <article
                    key={item.id}
                    className="service-card"
                    onClick={() => navigate(`/layanan/${item.id}`)}
                  >
                    <div className="card-media">
                      {item.gambar ? (
                        <img
                          src={`/uploads/${item.gambar}`}
                          alt={item.nama_layanan}
                          loading="lazy"
                          className="card-image"
                        />
                      ) : (
                        <div className="placeholder-image">
                          <span className="placeholder-icon">🏥</span>
                        </div>
                      )}
                      <div className="service-duration-badge">
                        <span className="duration-icon">⏱</span>
                        <span>{item.durasi_layanan} menit</span>
                      </div>
                    </div>

                    <div className="card-content">
                      <h3 className="card-title">{item.nama_layanan}</h3>
                      <p className="card-description">{item.deskripsi}</p>
                      <div className="card-footer">
                        <button className="view-service-btn">
                          Lihat Detail
                          <span className="arrow">→</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="doctor-spotlight" id="doctors-section">     
          <div className="section-header">
            <span className="section-tag">Our Doctors</span>
            <h2 className="section-title">Dokter Spesialis Kami</h2>
            <p className="section-subtitle">
              Tim dokter profesional kami siap memberikan pelayanan terbaik
            </p>
          </div>

          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div className="doctor-card" key={doctor.id}>
                <div className="doctor-image">
                  <img src={doctor.image} alt={doctor.name} />
                  {doctor.available && (
                    <span className="availability-badge">Available Today</span>
                  )}
                </div>
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p className="doctor-specialty">{doctor.specialty}</p>
                  <button className="schedule-btn">
                    Buat Janji
                    <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="emergency-contact" id="emergency-section">
          <div className="emergency-content">
            <div className="emergency-info">
              <span className="emergency-tag">24/7 Emergency</span>
              <h2>Butuh Bantuan Darurat? Hubungi Kami Sekarang!</h2>
              <p>Tim kami siap 24/7 untuk membantu Anda dalam situasi darurat medis.</p>
              <div className="emergency-number">
                <span className="phone-icon">📞</span>
                <a href="tel:119">119</a>
              </div>
            </div>
            <div className="emergency-actions">
              <button className="emergency-btn primary">
                <span className="icon">🚑</span>
                Panggil Ambulans
              </button>
              <button className="emergency-btn secondary">
                <span className="icon">💬</span>
                Chat Dokter
              </button>
            </div>
          </div>
        </section>


        <footer className="footer">
  <div className="footer-content">
    <div className="footer-top">
      <div className="footer-brand">
        <h2 className="footer-title">MedCare</h2>
        <p className="footer-description">
          Solusi kesehatan terpercaya untuk Anda dan keluarga.
        </p>
      </div>

      <div className="footer-links">
        <h4>Menu</h4>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Doctors</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>

      <div className="footer-contact">
        <h4>Hubungi Kami</h4>
        <p>Email: support@medcare.id</p>
        <p>Telp: (021) 123-4567</p>
      </div>

      <div className="footer-newsletter">
          <h4>Berlangganan untuk Update Kesehatan</h4>
          <p className="newsletter-desc">
            Dapatkan tips kesehatan, promo layanan terbaru, dan informasi penting langsung di email Anda.
          </p>
          <form className="newsletter-form">
            <label htmlFor="newsletter-email" className="visually-hidden">Email</label>
            <button type="submit" className="primary-btn">
              Subscribe
            </button>
          </form>
          <p className="newsletter-disclaimer">
            Kami menjaga privasi Anda. Tidak ada spam.
          </p>
        </div>
    </div>

    <div className="footer-bottom">
      <p>&copy; {new Date().getFullYear()} MedCare. All rights reserved.</p>
      <div className="footer-socials">
        <a href="#" aria-label="LinkedIn">🔗</a>
        <a href="#" aria-label="Instagram">📸</a>
        <a href="#" aria-label="Twitter">🐦</a>
      </div>
    </div>
  </div>
</footer>


        <button
  className="floating-antrian-btn"
  onClick={() => navigate("/antrian/form")}
  aria-label="Buat Antrian"
>
  <span style={{ fontSize: "1.2em", marginRight: 6, color: "white" }}>+</span>
  Buat Antrian
</button>

      </main>
    </div>
  );
};

export default DashboardPage;
