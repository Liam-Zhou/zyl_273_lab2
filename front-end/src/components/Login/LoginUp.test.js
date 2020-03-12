
import React from 'react';
import LoginUp from './LoginUp';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

it('login subcomponent page correctly', () => {
  const component = mount( <LoginUp ></LoginUp>);
  expect(component).toMatchSnapshot();
});

// it('changes the class when hovered', () => {
//     const component = renderer.create(
//       <Link page="http://www.twitter.com">Twitter</Link>
//     );
    
//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
    
//     // manually trigger the callback
//     tree.props.onMouseEnter();
//      // re-rendering
//     tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
    
//   });
