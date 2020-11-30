import * as React from 'react';

class RandomQuote extends React.Component {
   
  state = {
    id: 0,
    text: "",
    author: "",
    categoryId: 0,
    date: ""
  };

  componentDidMount() {
    const apiUrl = 'https://localhost:5001/quote/random';
//, {mode: 'no-cors',method:'GET', headers: {'Content-Type': 'application/json'}}
    fetch(apiUrl)
      .then((response) =>  response.json())
      .then((data) => {
        this.setState({text: data['text'], author: data['author'], categoryId: data['categoryId'], id: data['id'], date: data['date']});
        console.log(data);
        });
  }
  render() {
    return (
    <React.Fragment>
      <p style={{fontWeight: "bold"}}>{this.state.text}</p> <p style={{fontStyle: "italic"}}> - {this.state.author}</p>
    </React.Fragment>
    )
  }
}
export default RandomQuote;