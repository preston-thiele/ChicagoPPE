import { useState } from 'react'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interest: '',
    background: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      })

      if (!response.ok) throw new Error('Failed to submit')
      setIsSubmitted(true)
    } catch (error) {
      console.error('Submission error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="bg-atmosphere" />
      <div className="bg-pattern" />

      <nav>
        <div className="container nav-content">
          <div className="logo">Chicago<span>PPE</span></div>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          <ul className={`nav-links ${mobileMenuOpen ? 'show' : ''}`}>
            <li><a onClick={() => scrollTo('about')}>About</a></li>
            <li><a onClick={() => scrollTo('schedule')}>Schedule</a></li>
            <li><a onClick={() => scrollTo('join')}>Join Us</a></li>
          </ul>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">Weekly Discussions in Chicago</div>
            <h1>Where <em>Ideas</em> Meet Over Coffee</h1>
            <p className="hero-description">
              Join Chicago's community of curious minds exploring the intersections of philosophy, politics, and economics. No expertise required—just bring your questions.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => scrollTo('join')}>
                Join the Waitlist →
              </button>
              <button className="btn btn-secondary" onClick={() => scrollTo('about')}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="container">
          <div className="section-header">
            <p className="section-label">What We Do</p>
            <h2 className="section-title">Thoughtful Conversations, Every Week</h2>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <div className="card-icon">Φ</div>
              <h3>Philosophy</h3>
              <p>From ancient Stoicism to modern ethics, we explore the questions that have shaped human thought for millennia. What makes a good life? What do we owe each other?</p>
            </div>
            <div className="about-card">
              <div className="card-icon">§</div>
              <h3>Politics</h3>
              <p>Beyond partisan debates, we examine political theory, governance structures, and the ideas that shape our collective decisions. Civil discourse is our foundation.</p>
            </div>
            <div className="about-card">
              <div className="card-icon">∑</div>
              <h3>Economics</h3>
              <p>From market dynamics to behavioral economics, we discuss how resources, incentives, and institutions shape society and individual choices.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="schedule" id="schedule">
        <div className="container">
          <div className="schedule-content">
            <div className="schedule-info">
              <h2>When & Where</h2>
              <p>We gather weekly in a welcoming coffee shop atmosphere for structured yet informal discussions. Each session focuses on a specific topic, with readings shared beforehand for those who want to dive deeper.</p>
              <div className="schedule-details">
                <div className="detail-item">
                  <div className="detail-icon">I</div>
                  <div className="detail-text">
                    <strong>Every Week</strong>
                    <span>Consistent schedule shared with members</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">II</div>
                  <div className="detail-text">
                    <strong>Chicago Coffee Shop</strong>
                    <span>Location shared upon registration</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">III</div>
                  <div className="detail-text">
                    <strong>Intimate Groups</strong>
                    <span>Small groups for meaningful dialogue</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="schedule-visual">
              <div className="schedule-card">
                <p className="next-meeting">Format Preview</p>
                <p className="meeting-topic">"The Veil of Ignorance: Rawls and Modern Justice"</p>
                <div className="meeting-meta">
                  <span>Reading: 15 pages</span>
                  <span>Duration: 90 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="join" id="join">
        <div className="container">
          <div className="join-container">
            <div className="form-card">
              {!isSubmitted ? (
                <>
                  <div className="form-header">
                    <h2>Join the Conversation</h2>
                    <p>Sign up to join our waitlist and be notified of upcoming sessions</p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formState.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formState.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="interest">Primary Interest</label>
                      <select
                        id="interest"
                        name="interest"
                        value={formState.interest}
                        onChange={handleInputChange}
                      >
                        <option value="">Select your main interest</option>
                        <option value="philosophy">Philosophy</option>
                        <option value="politics">Politics</option>
                        <option value="economics">Economics</option>
                        <option value="all">All of the above</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="background">Tell us about yourself (optional)</label>
                      <textarea
                        id="background"
                        name="background"
                        value={formState.background}
                        onChange={handleInputChange}
                        placeholder="What draws you to PPE? Any particular topics you'd love to discuss?"
                      />
                    </div>
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Join the Waitlist'}
                    </button>
                  </form>
                  <p className="form-note">We'll reach out with meeting details and next steps.</p>
                </>
              ) : (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>You're on the list!</h3>
                  <p>We'll be in touch soon with details about our next gathering. Welcome to ChicagoPPE.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p className="footer-logo">ChicagoPPE</p>
          <p className="footer-text">Philosophy • Politics • Economics — Chicago</p>
        </div>
      </footer>
    </>
  )
}

export default App
