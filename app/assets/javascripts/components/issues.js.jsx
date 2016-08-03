import { Component } from 'react';

export default class Issues extends Component {
  constructor(props) {
    super(props);
    this.state = {issues: props.issues};
  }

  render() {
    let issues = this.state.issues;

    return (
      <ul>
        {issues.map(this.renderIssue)}
      </ul>
    );
  }

  renderIssue(issue) {
    return (
      <li key={issue.id}>{issue.title}</li>
    );
  }
}
