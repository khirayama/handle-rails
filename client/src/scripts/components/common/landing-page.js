import React from 'react';

import config from '../../../config';


export default function LandingPage() {
  return (
    <section className="page landing-page">
      <section className="page-content">
        <div className="landing-page-content">
          <section className="landing-page-content">
            <h1>
              { config.name } is simple task manager
              <br />
              for individaul
            </h1>
            <a href="/api/v1/auth/twitter" className="login-button">Sign in with Twitter</a>
          </section>
          <section className="landing-page-content">
            <h2>Concept</h2>
          </section>
          <section className="landing-page-content">
            <h2>Features</h2>
          </section>
          <section className="landing-page-content">
            <h2>Footer</h2>
          </section>
        </div>
      </section>
    </section>
  );
}
