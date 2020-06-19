import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { List, Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "./../../features/activities/dashboard/ActivityDashboard";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
	);
	const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string) => {
    //filter returns a new array so we need to choose the first item from the new array
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
	};
	
	const handleOpenCreateForm = () => {
		setSelectedActivity(null);
		setEditMode(true);
	}

  useEffect(() => {
    axios
      .get<IActivity[]>("http://localhost:5001/api/activities")
      .then((response) => {
        setActivities(response.data);
      });
  }, []);

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm}/>
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
					selectActivity={handleSelectActivity}
					selectedActivity={selectedActivity!}
					//selectedActivity! with the ! means selectedActivity or null to bypass type IActivity validation
					editMode={editMode}
					setEditMode={setEditMode}
					setSelectedActivity={setSelectedActivity}
        />
      </Container>
    </Fragment>
  );
};

export default App;

/*

interface IState {
	activities: IActivity[]
}

class App extends Component<{}, IState> {
	readonly state: IState = {
		activities: []
	}

	componentDidMount = () => {
		axios.get<IActivity[]>('http://localhost:5001/api/activities')
		.then((response) => {
			this.setState({
				activities: response.data
			})
		})
	}

	render() {
		return (
			<div>
				<Header as='h2' icon='users' content='Reactivities' />
				<List>
					{this.state.activities.map((activity: IActivity) => (
						<List.Item key={activity.id}>{activity.title}</List.Item>
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
*/
