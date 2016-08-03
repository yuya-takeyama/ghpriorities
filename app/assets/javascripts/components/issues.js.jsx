import { Component } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import Ago from 'react-ago-component'

const Issue = SortableElement(({ issue, issueState }) => {
  let className, style = {};

  const hidden = (issueState === 'OPEN' && issue.state !== 'open') ||
    (issueState === 'CLOSED' && issue.state !== 'closed');

  if (hidden) {
    style.display = 'none';
    className = 'issue-container hidden';
  } else {
    className = 'issue-container';
  }

  return (
    <li className={ className }>
      <div style={ style }>
        <IssueState state={ issue.state } />
        <div className="issue-title"><a href={ issue.html_url }>{ issue.title }</a></div>
        <IssueMisc issue={issue} />
      </div>
    </li>
  );
});

const IssueState = ({ state }) => {
  if (state === 'open') {
    return (<FontAwesome name='circle' className='issue-state issue-state-open' />);
  } else {
    return (<FontAwesome name='check-circle' className='issue-state issue-state-closed' />);
  }
};

const IssueMisc = ({ issue }) => {
  return (
    <div className="issue-misc">
      #{issue.number}
      {' '}
      opened <Ago date={issue.created_at} />
      {' '}
      by <img src={issue.user.avatar_url} className="issue-user-avatar" /> {issue.user.login}
    </div>
  );
};

const IssuesList = SortableContainer(({ issues, issueState }) => {
  return (
    <ul className='list-priorities'>
      {issues.map((issue, index) =>
        <Issue
          key={ `item-${ issue.id }` }
          index={ index }
          issue={ issue }
          issueState={ issueState }
        />
      )}
    </ul>
  );
});

export default class Issues extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issues: props.issues,
      issueState: 'OPEN',
    };
  }

  render() {
    return (
      <div>
        <div>
          <a href="#" onClick={this.showOpen.bind(this)}>Open</a>
          {' / '}
          <a href="#" onClick={this.showClosed.bind(this)}>Closed</a>
          {' / '}
          <a href="#" onClick={this.showAll.bind(this)}>All</a>
        </div>
        <IssuesList
          issues={this.state.issues}
          issueState={this.state.issueState}
          onSortEnd={this.onSortEnd.bind(this)}
        />
      </div>
    );
  }

  onSortEnd({ oldIndex, newIndex }) {
    this.setState({
      issues: arrayMove(this.state.issues, oldIndex, newIndex),
    });

    if (oldIndex !== newIndex) {
      this.sync();
    }
  }

  sync() {
    const priorities = this.state.issues
      .map((issue, index) => {
        return {id: issue.id, index: index};
      })
      .reduce((acc, priority) => {
        acc[priority.id] = priority.index;
        return acc;
      }, {});

    axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
    axios.defaults.headers['X-CSRF-Token'] = document.querySelector('meta[name=csrf-token]').content;

    axios
      .put(`/dashboards/${this.props.dashboardId}/priorities`, { dashboard: { priorities } });
  }

  showAll(event) {
    event.preventDefault();
    this.setState({issueState: 'ALL'});
  }

  showOpen(event) {
    event.preventDefault();
    this.setState({issueState: 'OPEN'});
  }

  showClosed(event) {
    event.preventDefault();
    this.setState({issueState: 'CLOSED'});
  }
}
