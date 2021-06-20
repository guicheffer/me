import React from 'react';

import Layout from '../components/Layout';

if (typeof window !== 'undefined') {
  if (window.location.pathname === "/netzpolitik") {
    window.location.href="https://netzpolitik.org/2021/npp-232-zur-digitalen-vergabe-von-impfterminen-ein-angebot-dass-du-nicht-annehmen-kannst/"
  }
}

const NetzpolitikPage = () => (
  <Layout>
    Redirecting...
  </Layout>
);

export default NetzpolitikPage;