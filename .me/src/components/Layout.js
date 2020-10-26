import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import '../assets/sass/resume.scss';
import avatar from '../assets/images/avatar.jpeg';

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
                { name: 'description', content: data.site.siteMetadata.description },
                { name: 'keywords', content: 'site, web' },
              ]}
            >
              <html lang="en" />

              {/* Facebook Meta Tags */}
              <meta property="og:url" content="https://guicheffer.me/"/>
              <meta property="og:type" content="website"/>
              <meta property="og:title" content={data.site.siteMetadata.title}/>
              <meta property="og:description" content={data.site.siteMetadata.description}/>
              <meta property="og:image" content={avatar}/>

              {/* Twitter Meta Tags */}
              <meta name="twitter:card" content="summary_large_image"/>
              <meta property="twitter:domain" content="guicheffer.me"/>
              <meta property="twitter:url" content="https://guicheffer.me/"/>
              <meta name="twitter:title" content={data.site.siteMetadata.title}/>
              <meta name="twitter:description" content={data.site.siteMetadata.description}/>
              <meta name="twitter:image" content={avatar}/>
            </Helmet>
            <div className={'main-body'}>{children}</div>
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
