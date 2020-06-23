import React, { SyntheticEvent } from "react";
import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "./../details/ActivityDetails";
import ActivityForm from "./../form/ActivityForm";

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  selectedActivity: IActivity | null;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (activity: IActivity | null) => void;
  createActivity: (e: SyntheticEvent<HTMLFormElement>, activity: IActivity) => void;
  editActivity: (e: SyntheticEvent<HTMLFormElement>, activity: IActivity) => void;
	deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
	submitting: boolean;
	target: string;
}

const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectActivity,
  selectedActivity,
  editMode,
  setEditMode,
  setSelectedActivity,
  createActivity,
	editActivity,
	deleteActivity,
	submitting,
	target
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
					deleteActivity={deleteActivity}
					submitting={submitting}
					target={target}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && !editMode && (
          <ActivityDetails
            activity={selectedActivity}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
          />
        )}
        {editMode && (
          <ActivityForm
            key={(selectedActivity && selectedActivity.id) || 0}
            //have a key prop value that changes allows you to return the exact same element type, but force React to unmount the previous instance, and mount a new one.
            //this effectively allows you to refresh all the inputs in the activity create/edit form when you click "create new activity" after having the form inputs already populated from a previous selected activity
            //https://kentcdodds.com/blog/understanding-reacts-key-prop
            setEditMode={setEditMode}
            activity={selectedActivity!}
            createActivity={createActivity}
						editActivity={editActivity}
						submitting={submitting}
						target={target}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
