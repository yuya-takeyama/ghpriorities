import { Component } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

const Issue = SortableElement(({ issue }) => {
  return (<li>{issue.title}</li>);
});

const IssuesList = SortableContainer(({ issues }) => {
  return (
    <ul>
      {issues.map((issue, index) =>
        <Issue key={`item-${ issue.id }`} index={ index } issue={ issue } />
      )}
    </ul>
  );
});

export default class Issues extends Component {
  constructor(props) {
    super(props);
    this.state = {issues: props.issues};
  }

  onSortEnd({ oldIndex, newIndex }) {
    this.setState({
      issues: arrayMove(this.state.issues, oldIndex, newIndex),
    })
  }

  render() {
    return (<IssuesList issues={this.state.issues} onSortEnd={this.onSortEnd.bind(this)} />);
  }
}
