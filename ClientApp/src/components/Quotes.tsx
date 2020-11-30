import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as YodaOfTheDayStore from '../store/YodaOfTheDay';

// At runtime, Redux will merge together...
type YodaOfTheDayProps =
  YodaOfTheDayStore.YodaOfTheDayState // ... state we've requested from the Redux store
  & typeof YodaOfTheDayStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters


class Quotes extends React.PureComponent<YodaOfTheDayProps> {
  // This method is called when the component is first added to the document
  public componentDidMount() {
    this.ensureDataFetched();
  }

  // This method is called when the route parameters change
  public componentDidUpdate() {
    this.ensureDataFetched();
  }

  public render() {
    return (
      <React.Fragment>
        <h1 id="tabelLabel">Star Wars Quotes</h1>
        <p>This a set of (not so) motivational quotes carefully curated by Master Yoda.</p>
        {this.renderQuotesTable()}
        {this.renderPagination()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
    this.props.requestYodaOfTheDay(startDateIndex);
  }

  private renderQuotesTable() {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>id</th>
            <th>Text</th>
            <th>Author</th>
            <th>Date</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {this.props.quotes.map((quotes: YodaOfTheDayStore.YodaOfTheDay) =>
            <tr key={quotes.id}>
              <td>{quotes.id}</td>
              <td>{quotes.text}</td>
              <td>{quotes.author}</td>
              <td>{quotes.date}</td>
              <td>{quotes.categoryId}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  private renderPagination() {
    const prevStartDateIndex = (this.props.startDateIndex || 0) - 5;
    const nextStartDateIndex = (this.props.startDateIndex || 0) + 5;

    return (
      <div className="d-flex justify-content-between">
        <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${prevStartDateIndex}`}>Previous</Link>
        {this.props.isLoading && <span>Loading...</span>}
        <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${nextStartDateIndex}`}>Next</Link>
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => state.yodaOfTheDay, // Selects which state properties are merged into the component's props
  YodaOfTheDayStore.actionCreators // Selects which action creators are merged into the component's props
)(Quotes as any);
