import React, { useEffect, useState } from 'react';

import meCelebing from '../../assets/images/30-rvsp-2.png';
import Layout from '../../components/Layout';

import '../../assets/sass/rvsp.scss';

const LIST30 = () => {
  const mockData = [
    {
      key: '1657314307406',
      value: '{"attending":"yes","name":"João Guilherme  Cheffer Prado"}',
      created_at: 1.657314307929e9,
      updated_at: 1.657314307929e9,
    },
    {
      key: '1657311827450',
      value: '{"attending":"yes","name":"Luiza Soubihe"}',
      created_at: 1.657311828094e9,
      updated_at: 1.657311828094e9,
    },
  ];
  const [data, setData] = useState(mockData);

  useEffect(() => {
    fetch(`https://api.kvstore.io/collections/guests/items`, {
      method: 'GET',
      headers: {
        kvstoreio_api_key:
          '452ed2220bdcabcd4f4d867410ebaa8c86d47b632452bda1a11799b0b8610507',
      },
    })
      .then(data => {
        console.log(data);
        setData(data);
      })
      .catch(() => {});
  });

  if (!data.length) return <></>;

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

      <table className="rvsp-list">
        <tr>
          <th className="rvsp-list--name">Name</th>
          <th className="rvsp-list--attending">Attending?</th>
        </tr>

        {data.map(row => {
          const guest = JSON.parse(row.value);

          return (
            <tr key={row.key}>
              <td>{guest.name}</td>
              <td className={`rvsp-list--attending--${guest.attending}`}>
                {guest.attending}
              </td>
            </tr>
          );
        })}
      </table>
    </Layout>
  );
};

export default LIST30;
