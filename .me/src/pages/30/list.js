import React, { useEffect, useState } from 'react';

import meCelebing from '../../assets/images/30-rvsp-2.png';
import Layout from '../../components/Layout';

import '../../assets/sass/rvsp.scss';

const LIST30 = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      `https://joao-30th-bday-cors-anywhere.herokuapp.com/https://api.kvstore.io/collections/guests/items`,
      {
        method: 'GET',
        headers: {
          kvstoreio_api_key:
            '452ed2220bdcabcd4f4d867410ebaa8c86d47b632452bda1a11799b0b8610507',
        },
      }
    )
      .then(data => data.json())
      .then(data => setData(data))
      // TODO: Add error catch later
      .catch(() => {});
  }, []);

  if (!data.length) return <>Loading...</>;

  return (
    <Layout>
      <header>
        <picture className="picture">
          <img
            className="picture-image"
            src={meCelebing}
            alt="Me, celebrating nothing"
          />
        </picture>
      </header>

      <p>
        <strong>Total</strong>: {data.length}
      </p>

      <table className="rvsp-list">
        <thead>
          <tr>
            <th className="rvsp-list--name">Name</th>
            <th className="rvsp-list--attending">Attending?</th>
            <th className="rvsp-list--id">ID</th>
          </tr>
        </thead>

        <tbody>
          {data.length &&
            data.map(row => {
              const guest = JSON.parse(row.value);

              return (
                <tr key={row.key}>
                  <td>{guest.name}</td>
                  <td className={`rvsp-list--attending--${guest.attending}`}>
                    {guest.attending}
                  </td>
                  <td>{row.key}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </Layout>
  );
};

export default LIST30;
