import React, { useCallback, useState } from 'react';

import Layout from '../../components/Layout';

import '../../assets/sass/rvsp.scss';

const FormReply = () => {
  const [canProceed, setCanProceed] = useState(false);
  const onSubmit = useCallback(event => {
    event.stopPropagation();
  }, []);

  return (
    <>
      <hr className="rvsp-divider" />

      <form className="rvsp" method="POST" action="#" onSubmit={onSubmit}>
        <div className="rvsp-field--attending">
          <p className="rvsp--attending">❓ Attending?</p>

          <div className="rvsp--attending-wrapper">
            <input
              name="attending"
              className="rvsp-attending"
              type="radio"
              id="yes"
              value="yes"
              required
              onChange={() => setCanProceed(true)}
            />
            <label htmlFor="yes">Yes</label>

            <input
              name="attending"
              className="rvsp-attending"
              type="radio"
              id="no"
              value="no"
              onChange={() => setCanProceed(true)}
            />
            <label htmlFor="no">No</label>

            <input
              name="attending"
              className="rvsp-attending"
              type="radio"
              id="maybe"
              value="maybe"
              onChange={() => setCanProceed(true)}
            />
            <label htmlFor="maybe">Maybe</label>
          </div>
        </div>

        <div className="rvsp-field">
          <label htmlFor="name">Your name</label>
          <input
            required
            id="name"
            name="name"
            className="rvsp-name"
            type="text"
          />
        </div>

        <div className="rvsp-field">
          <label htmlFor="surname">Your last name</label>
          <input
            required
            id="surname"
            name="surname"
            className="rvsp-surname"
            type="text"
          />
        </div>

        <button
          disabled={!canProceed}
          className="button submit"
          onClick={onSubmit}
        >
          Submit
        </button>
      </form>
    </>
  );
};

const RVSP30 = () => {
  const [isReplying, setIsReplying] = useState(false);
  const onReply = useCallback(() => {
    setIsReplying(true);
  }, []);

  return (
    <Layout>
      <header>
        <picture className="picture">
          <img
            className="picture-image"
            src="/30-rvsp-2.png"
            alt="Me, celebrating nothing"
          />
        </picture>
      </header>

      <section>
        <div className="description">
          <q className="description--quote">
            Dear 30s, I'm <strike>waiting</strike> ready for you!
          </q>

          <h4>
            Hey! If you have received this, it's because I would love you to be
            part of my 30th birthday celebration! 🎉
          </h4>

          <p>
            Below, there's all the info you need, please make sure you submit
            your RVSP so I may hopefully count on you when doing the reservation
            at the specified location. 🙂
          </p>

          <section className="details">
            <div className="details-piece">
              <p className="details--label">
                <strong>📆 When</strong>
              </p>

              <p className="details--info">Sat, July 16th at ~2pm</p>
            </div>

            <div className="details-piece">
              <p className="details--label">
                <strong>📍 Where</strong>
              </p>

              <p className="details--info">
                <a href="https://goo.gl/maps/hV6LVE5J1EKrD6KE6" target="_blank">
                  Zollpackhof
                </a>{' '}
                <p>Elisabeth-Abegg-Straße 1, 10557 Berlin)</p>
              </p>
            </div>
          </section>

          {isReplying && <FormReply />}

          {!isReplying && (
            <button className="button reply" onClick={onReply}>
              Reply
            </button>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default RVSP30;
