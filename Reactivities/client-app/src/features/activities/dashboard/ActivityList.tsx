import React, { useContext} from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import { Link } from "react-router-dom";

const ActivityList: React.FC = () => {
	const activityStore = useContext(ActivityStore);
	const {activitiesByDate, deleteActivity, submitting, target} = activityStore;
  return (
    <Segment clearing>
      <Item.Group divided>
        {activitiesByDate.map((activity) => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
									// onClick={() => selectActivity(activity.id)}
									as={Link} to={`/activities/${activity.id}`}
                  floated="right"
                  content="View"
                  color="blue"
                />
                <Button
									name={activity.id}
									//the loading prop determines when the loading spinner icon shows
									//true is to display spinner and false is to hide
									//when the button is clicked... the target is set to equal activity.id
									//from the onClick function and sumitting is set to true and then false
									//when the process is over
									loading={target === activity.id && submitting}
                  onClick={(e) => deleteActivity(e, activity.id)}
                  floated="right"
                  content="Delete"
                  color="red"
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default observer(ActivityList);
