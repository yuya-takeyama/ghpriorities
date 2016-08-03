import { Component } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import axios from 'axios';

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

  render() {
    return (<IssuesList issues={this.state.issues} onSortEnd={this.onSortEnd.bind(this)} />);
  }

  onSortEnd({ oldIndex, newIndex }) {
    this.setState({
      issues: arrayMove(this.state.issues, oldIndex, newIndex),
    });

    this.sync();
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
}
