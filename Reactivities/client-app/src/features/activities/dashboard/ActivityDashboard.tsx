import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import ActivityStore from '../../../app/stores/activityStore';
import LoadingComponent from '../../../app/layout/LoadingComponent';

const ActivityDashboard: React.FC = () => {
	const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
		return <LoadingComponent content="Loading activities..." />;
		
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
				{/*
        {activity && !editMode && (
          <ActivityDetails />
        )}
        {editMode && (
          <ActivityForm
            key={(activity && activity.id) || 0}
            //have a key prop value that changes allows you to return the exact same element type, but force React to unmount the previous instance, and mount a new one.
            //this effectively allows you to refresh all the inputs in the activity create/edit form when you click "create new activity" after having the form inputs already populated from a previous selected activity
            //https://kentcdodds.com/blog/understanding-reacts-key-prop
            activity={activity!}
          />
				)}
				*/}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
