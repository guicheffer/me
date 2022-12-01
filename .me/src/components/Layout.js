import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import '../assets/sass/resume.scss';
import avatar from '../assets/images/avatar-2.jpeg';

class Layout extends Component {
  render() {
    const { children } = this.props;
    return (
      <StaticQuery
        query={graphql`
          query SiteTitleQuery {
            site {
              siteMetadata {
                title
                description
              }
            }
          }
        `}
        render={data => (
          <>
            <Helmet
              title={data.site.siteMetadata.title}
              meta={[
                {
                  name: 'description',
                  content: data.site.siteMetadata.description,
                },
                { name: 'keywords', content: 'site, web' },
              ]}
            >
              <html lang="en" />

              {/* Facebook Meta Tags */}
              <meta property="og:url" content="https://guicheffer.me/" />
              <meta property="og:type" content="website" />
              <meta
                property="og:title"
                content={data.site.siteMetadata.title}
              />
              <meta
                property="og:description"
                content={data.site.siteMetadata.description}
              />
              <meta property="og:image" content={avatar} />

              {/* Twitter Meta Tags */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta property="twitter:domain" content="guicheffer.me" />
              <meta property="twitter:url" content="https://guicheffer.me/" />
              <meta
                name="twitter:title"
                content={data.site.siteMetadata.title}
              />
              <meta
                name="twitter:description"
                content={data.site.siteMetadata.description}
              />
              <meta name="twitter:image" content={avatar} />

              {/* Global site tag (gtag.js) - Google Analytics */}
              <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-ZD8LXGMM14"
              />
              <script>
                {
                  "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-ZD8LXGMM14');"
                }
              </script>
            </Helmet>
            <div className={'guicheffer-me'}>{children}</div>
          </>
        )}
      />
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
