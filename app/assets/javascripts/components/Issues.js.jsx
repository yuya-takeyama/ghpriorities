class Issues extends React.Component {
  constructor(props) {
    super(props);
    this.state = {issues: props.issues};
  }

  render() {
    let issues = this.state.issues;

    return (
      <ul>
        {issues.map(this.render_issue)}
      </ul>
    );
  }

  render_issue(issue) {
    return (
      <li key={issue.id}>{issue.title}</li>
    );
  }
}
