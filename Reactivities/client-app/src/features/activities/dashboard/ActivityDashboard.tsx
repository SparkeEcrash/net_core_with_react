import React, { SyntheticEvent, useContext } from "react";
import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "./../details/ActivityDetails";
import ActivityForm from "./../form/ActivityForm";
import { observer } from "mobx-react-lite";
import ActivityStore from "./../../../app/stores/activityStore";

interface IProps {
	deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
	submitting: boolean;
	target: string;
}

const ActivityDashboard: React.FC<IProps> = ({
	deleteActivity,
	submitting,
	target
}) => {
	const activityStore = useContext(ActivityStore);
	const { editMode, selectedActivity } = activityStore;
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
					deleteActivity={deleteActivity}
					submitting={submitting}
					target={target}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetails />
        )}
        {editMode && (
          <ActivityForm
            key={(selectedActivity && selectedActivity.id) || 0}
            //have a key prop value that changes allows you to return the exact same element type, but force React to unmount the previous instance, and mount a new one.
            //this effectively allows you to refresh all the inputs in the activity create/edit form when you click "create new activity" after having the form inputs already populated from a previous selected activity
            //https://kentcdodds.com/blog/understanding-reacts-key-prop
            activity={selectedActivity!}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
