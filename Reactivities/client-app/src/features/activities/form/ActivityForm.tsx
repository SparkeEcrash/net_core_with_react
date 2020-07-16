import React, {
  SyntheticEvent,
  useState,
  FormEvent,
  useContext,
  useEffect,
} from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  //activity is being renamed to initialFormState to avoid the variable name activity overlapping with other ones that come later in the function
  //this is object destructuring
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    target,
    submitting,
    activity: initialFormState,
    loadActivity,
    clearActivity,
  } = activityStore;

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      //the second condition 'activity.id.length === 0' is needed to prevent setActivity from running
      //after the form is submitted which triggers navigation to another page.
      //the setActivity will try to alter the state of an unmounted component which will create warning

      //activity.id.length === 0 ensures activity had been set to activity in useState rather
      //than being cleared as null in the clearActivity after it gets unmounted within the useEffect
      //return function section
      loadActivity(match.params.id).then(
        () => initialFormState && setActivity(initialFormState)
      );
    }
    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    clearActivity,
    match.params.id,
    initialFormState,
    activity.id.length,
  ]);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(e, newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      editActivity(e, activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //event.currentTarget is needed because event.currentTarget is the react version of event.target which is required for typescript validating FormEvent<HTMLInputElement> type
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
    // you are spreading the the object in "activity" and replacing the "title" property with the one that is listed after. You are creating a copy of activity with the replaced title.
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form name="activity-form" onSubmit={(e) => handleSubmit(e)}>
            <Form.Input
              onChange={handleInputChange}
              name="title"
              placeholder="Title"
              value={activity.title}
            />
            <Form.TextArea
              onChange={handleInputChange}
              name="description"
              rows={2}
              placeholder="Description"
              value={activity.description}
            />
            <Form.Input
              onChange={handleInputChange}
              name="category"
              placeholder="Category"
              value={activity.category}
            />
            <Form.Input
              onChange={handleInputChange}
              name="date"
              type="datetime-local"
              placeholder="Date"
              value={activity.date}
            />
            <Form.Input
              onChange={handleInputChange}
              name="city"
              placeholder="City"
              value={activity.city}
            />
            <Form.Input
              onChange={handleInputChange}
              name="venue"
              placeholder="Venue"
              value={activity.venue}
            />
            <Button
              loading={target === "activity-form" && submitting}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              onClick={() => history.push("/activities")}
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
