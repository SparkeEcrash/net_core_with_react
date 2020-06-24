import React, { SyntheticEvent, useState, useEffect, useContext, Fragment } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "./../../features/activities/dashboard/ActivityDashboard";
import agent from "./../api/agent";
import LoadingComponent from "./LoadingComponent";
import ActivityStore from "../stores/activityStore";

const App = () => {
	const activityStore = useContext(ActivityStore);
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
	);
	const [editMode, setEditMode] = useState(false);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [target, setTarget] = useState('');

  const handleSelectActivity = (id: string) => {
    //filter returns a new array so we need to choose the first item from the new array
		setSelectedActivity(activities.filter((a) => a.id === id)[0]);
		setEditMode(false);
	};
	
	const handleOpenCreateForm = () => {
		setSelectedActivity(null);
		setEditMode(true);
	}

	const handleCreateActivity = (event: SyntheticEvent<HTMLFormElement>, activity: IActivity) => {
		setSubmitting(true);
		console.log(event.currentTarget.name);
		setTarget(event.currentTarget.name);
		agent.Activities.create(activity).then(() => {
			setActivities([...activities, activity]);
			setSelectedActivity(activity);
			setEditMode(false);	
		}).then(() => setSubmitting(false))
	}

	const handleEditActivity = (event: SyntheticEvent<HTMLFormElement>, activity: IActivity) => {
		setSubmitting(true);
		console.log(event.currentTarget.name);
		setTarget(event.currentTarget.name);
		agent.Activities.update(activity).then(() => {
			setActivities([...activities.filter(a => a.id !== activity.id), activity])
			setSelectedActivity(activity);
			setEditMode(false);
		}).then(() => setSubmitting(false))
	}

	const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
		setSubmitting(true);
		setTarget(event.currentTarget.name);
		agent.Activities.delete(id).then(() => {
			setActivities([...activities.filter(a => a.id !== id)])
		}).then(() => setSubmitting(false))
	}

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
				let activities: IActivity[] = [];
				response.forEach(activity => {
					activity.date = activity.date.split('.')[0];
					activities.push(activity);
				})
        setActivities(activities);
      }).then(() => setLoading(false));
	}, []);
	
	if (loading) return <LoadingComponent content='Loading activities...' />

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
					createActivity={handleCreateActivity}
					editActivity={handleEditActivity}
					deleteActivity={handleDeleteActivity}
					submitting={submitting}
					target={target}
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
