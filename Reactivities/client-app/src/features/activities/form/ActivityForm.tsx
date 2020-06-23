import React, { SyntheticEvent, useState, FormEvent } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";

interface IProps {
  setEditMode: (editMode: boolean) => void;
  activity: IActivity | null;
  createActivity: (event: SyntheticEvent<HTMLFormElement>, activity: IActivity) => void;
  editActivity: (event: SyntheticEvent<HTMLFormElement>, activity: IActivity) => void;
	submitting: boolean;
	target: string;
}

const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: initialFormState,
  createActivity,
  editActivity,
	submitting,
	target
}) => {
  //activity is being renamed to initialFormState to avoid the variable name activity overlapping with other ones that come later in the function
  //this is object destructuring

  const initializeForm = () => {
    if (initialFormState) {
      return initialFormState;
    } else {
      return {
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: "",
      };
    }
  };

  const [activity, setActivity] = useState<IActivity>(initializeForm);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(e, newActivity);
    } else {
      editActivity(e, activity);
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
					loading={(target === 'activity-form') && submitting}
          floated="right"
          positive
          type="submit"
          content="Submit"
        />
        <Button
          onClick={() => setEditMode(false)}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
