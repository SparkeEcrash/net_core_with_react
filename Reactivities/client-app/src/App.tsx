import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react'

class App extends Component {
	state = {
		values: []
	}

	componentDidMount = () => {
		axios.get('http://localhost:5000/api/values')
		.then((response) => {
			this.setState({
				values: response.data
			})
		})

		this.setState({
			values: [{id: 1, name: 'Value 101'}, {id: 2, name: 'Value 102'}]
		})
	}

	render() {
		return (
			<div>
				<Header as='h2' icon='users' content='Reactivities' />
				<List>
					{this.state.values.map((value: any) => (
						<List.Item key={value.id}>{value.name}</List.Item>
					))}
				</List>
			</div>
		)
	}
}


// const App: React.FC = () => {
// 	return (
// 		<div className="App">
// 			<ul>
// 				{cars.map((car) => (
// 					<CarItem car={car} />
// 				))}
// 			</ul>
// 		</div>
// 	)
// }

export default App;
