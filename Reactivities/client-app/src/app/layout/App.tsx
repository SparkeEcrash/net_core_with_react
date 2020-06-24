import React, { SyntheticEvent, useState, useEffect, useContext, Fragment } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "./../../features/activities/dashboard/ActivityDashboard";
import agent from "./../api/agent";
import LoadingComponent from "./LoadingComponent";
import ActivityStore from "../stores/activityStore";
import { observer } from "mobx-react-lite";

//https://mobx.js.org/refguide/observable-decorator.html

const App = () => {
	const activityStore = useContext(ActivityStore);
  const [activities, setActivities] = useState<IActivity[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [target, setTarget] = useState('');

  // const handleSelectActivity = (id: string) => {
  //   //filter returns a new array so we need to choose the first item from the new array
	// 	setSelectedActivity(activities.filter((a) => a.id === id)[0]);
	// 	setEditMode(false);
	// };

	// const handleCreateActivity = (event: SyntheticEvent<HTMLFormElement>, activity: IActivity) => {
	// 	setSubmitting(true);
	// 	console.log(event.currentTarget.name);
	// 	setTarget(event.currentTarget.name);
	// 	agent.Activities.create(activity).then(() => {
	// 		setActivities([...activities, activity]);
	// 		setSelectedActivity(activity);
	// 		setEditMode(false);	
	// 	}).then(() => setSubmitting(false))
	// }

	// const handleEditActivity = (event: SyntheticEvent<HTMLFormElement>, activity: IActivity) => {
	// 	setSubmitting(true);
	// 	console.log(event.currentTarget.name);
	// 	setTarget(event.currentTarget.name);
	// 	agent.Activities.update(activity).then(() => {
	// 		setActivities([...activities.filter(a => a.id !== activity.id), activity])
	// 		setSelectedActivity(activity);
	// 		setEditMode(false);
	// 	}).then(() => setSubmitting(false))
	// }

	const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
		setSubmitting(true);
		setTarget(event.currentTarget.name);
		agent.Activities.delete(id).then(() => {
			setActivities([...activities.filter(a => a.id !== id)])
		}).then(() => setSubmitting(false))
	}

  useEffect(() => {
    activityStore.loadActivities();
	}, [activityStore]);
	
	if (activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
					//selectedActivity! with the ! means selectedActivity or null to bypass type IActivity validation
					deleteActivity={handleDeleteActivity}
					submitting={submitting}
					target={target}
        />
      </Container>
    </Fragment>
  );
};

export default observer(App);

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
