import React, {
  Fragment,
} from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "./../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, withRouter, RouteComponentProps } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

//https://mobx.js.org/refguide/observable-decorator.html

const App: React.FC<RouteComponentProps> = ({ location }) => {

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

  // const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
  // 	setSubmitting(true);
  // 	setTarget(event.currentTarget.name);
  // 	agent.Activities.delete(id).then(() => {
  // 		setActivities([...activities.filter(a => a.id !== id)])
  // 	}).then(() => setSubmitting(false))
  // }

  return (
    <Fragment>
      <Route exact path="/" component={HomePage} />
      {/* 
			when we are hitting the a route that with a forward slash and anything else this is the route that will match
			*/}

      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              {/*
        <ActivityDashboard
					// selectedActivity={selectedActivity!}
					//selectedActivity! with the ! means selectedActivity or null to bypass type IActivity validation
        />
				*/}
              <Route exact path="/activities" component={ActivityDashboard} />
              <Route path="/activities/:id" component={ActivityDetails} />
              <Route
                key={location.key}
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
              />
              {/*
					have a key prop value that changes allows you to return the exact same element type, but force React to unmount the previous instance, and mount a new one.
          //this effectively allows you to refresh all the inputs in the activity create/edit form when you click "create new activity" after having the form inputs already populated from a previous selected activity
          //https://kentcdodds.com/blog/understanding-reacts-key-prop
					activity={activity!}
				*/}
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));

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
