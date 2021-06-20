import React from 'react';

import Layout from '../components/Layout';

if (typeof window !== 'undefined') {
  if (window.location.pathname.includes("/ep-spotify")) {
    window.location.href="https://open.spotify.com/episode/5us1VLFTeEtXe7LuGfwr16"
  }
}

const EpSpotify = () => (
  <Layout>
    Redirecting...
  </Layout>
);

export default EpSpotify;