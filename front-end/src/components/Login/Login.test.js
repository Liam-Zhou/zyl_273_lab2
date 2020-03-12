
import React from 'react';
import Login from './Login';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

it('login page correctly', () => {
  const component = mount( <Login ></Login>);
  expect(component).toMatchSnapshot();
});
