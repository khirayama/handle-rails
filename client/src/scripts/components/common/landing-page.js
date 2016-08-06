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
        </div>
      </section>
    </section>
  );
}
