import React from 'react';
import { render, screen } from '@testing-library/react';

import {mockAssignments} from '../../../utils/mockRingLeaderAPIs';
import AssignmentsNavPane from './AssignmentsNavPane';
import {Provider} from "react-redux";
import store from "../../../app/combinedStore";

let elem;

describe('While loading assignments', () => {
  beforeEach(() => {
     elem = render(
      <Provider store={store}>
        {/* assignments must be set in the store, now*/}
        <AssignmentsNavPane assignments={mockAssignments}/>
      </Provider>
    );
  });

  test('Shows the loading indicator', () => {
    const loadingIndicator = elem.container.querySelector(`.loading-indicator`);
    expect(loadingIndicator).toBeDefined();
  });

  test(`Does NOT show the 'nav pane' title`, () => {
    const linkElement = elem.queryByText('nav pane');
    expect(linkElement).not.toBeInTheDocument();
  });
});

describe('After loading assignments', () => {
  beforeEach(() => {
    elem = render(
      <Provider store={store}>
        <AssignmentsNavPane assignments={mockAssignments}/>
      </Provider>
    );
  });

  test('Does NOT show the loading indicator', () => {
    const loadingIndicator = elem.container.querySelector(`.loading-indicator`);
    expect(loadingIndicator).toBeNull();
  });

  test(`Shows the 'nav pane' title`, () => {
    const linkElement = elem.getByText('nav pane');
    expect(linkElement).toBeInTheDocument();
  });

  test('Shows correct number of assignment links', () => {
    const navItems = elem.container.querySelectorAll(`.assignment-nav-item`);
    expect(navItems.length).toBe(2);
  });

  test('Shows create assignment button', () => {
    expect(elem.getByRole('button')).not.toHaveAttribute('disabled');
  });

  test('Shows the correct assignment titles', () => {
    expect(elem.getByText(mockAssignments[0].title)).toBeInTheDocument();
    expect(elem.getByText(mockAssignments[1].title)).toBeInTheDocument();
  });

});