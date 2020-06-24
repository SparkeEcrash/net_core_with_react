import React, { useContext } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";

const ActivityDetails: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { selectedActivity: activity, openEditForm, cancelSelectedActivity } = activityStore;
  //import selectedActivity as activity which is object destructuring
  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity!.category}.jpg`}
        // "!" is to allow for activity to be undefined while compiling
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span className="date">{activity!.date}</span>
        </Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            onClick={() => openEditForm()}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            onClick={cancelSelectedActivity}
            basic
            color="grey"
            content="Cancel"
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);
