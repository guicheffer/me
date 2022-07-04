import React, { Component } from 'react';
import Scrollspy from 'react-scrollspy';
import Scroll from './Scroll';

import avatar from '../assets/images/avatar.jpeg';
import config from '../../config';

export class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        { content: 'About', href: 'about' },
        // { content: 'Experience', href: 'experience' },
        // { content: 'Education', href: 'education' },
        { content: 'Skills', href: 'skills' },
        // { content: 'Interests', href: 'interests' },
        // { content: 'Awards', href: 'awards' },
        { content: 'Blog', href: 'blog', inConstruction: true, title: 'Soon' },
      ],
      isCollapsed: true,
    };
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  toggleNavbar() {
    this.setState({
      isCollapsed: !this.state.isCollapsed,
    });
  }

  render() {
    const { tabs, isCollapsed } = this.state;
    return (
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top"
        id="sideNav"
      >
        <Scroll type="id" element={'about'}>
          <a className="navbar-brand" href="#about">
            <span className="d-block d-lg-none">
              {config.firstName} {config.lastName}
            </span>
            <span className="d-none d-lg-block">
              <img
                className="img-fluid img-profile rounded-circle mx-auto mb-2"
                src={avatar}
                alt=""
              />
            </span>
          </a>
        </Scroll>
        <button
          className={`navbar-toggler navbar-toggler-right ${
            isCollapsed ? 'collapsed' : ''
          }`}
          type="button"
          data-toggle="collapse"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={this.toggleNavbar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`}
          id="navbarSupportedContent"
          role="navigation"
        >
          <Scrollspy
            items={tabs.map(s => s.href)}
            currentClassName="active"
            offset={-300}
            className="navbar-nav"
          >
            {tabs.map((tab, i) => {
              const { href, content, inConstruction = false, title } = tab;
              return (
                <li
                  className={`nav-item ${
                    inConstruction ? 'nav-item--disabled' : ''
                  }`}
                  title={inConstruction ? 'Soon!' : `Access ${title}`}
                  key={href}
                >
                  <Scroll type="id" element={href}>
                    <a
                      className="nav-link"
                      href={`#${href}`}
                      disabled={inConstruction}
                      title={title || content}
                    >
                      {content}
                    </a>
                  </Scroll>
                </li>
              );
            })}
          </Scrollspy>
        </div>
      </nav>
    );
  }
}

export default Sidebar;
