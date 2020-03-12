
import React from 'react';
import SignUp from './SignUp';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

it('sign up page correctly', () => {
  const component = mount( <SignUp ></SignUp>);
  expect(component).toMatchSnapshot();
});

