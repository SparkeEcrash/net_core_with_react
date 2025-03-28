import React from 'react'
import { Segment, Item, Image, Header, Button } from 'semantic-ui-react'
import { observer } from "mobx-react-lite";
import { IActivity } from '../../../app/models/activity';

const activityImageStyle = {
	filter: 'brightness(30%)'
};

const activityImageTextStyle = {
	position: 'absolute',
	bottom: '5%',
	left: '5%',
	width: '100%',
	height: 'auto',
	color: 'white'
};

const ActivityDetailedHeader: React.FC<{activity: IActivity}> = ({activity}) => {
	return (
		    <Segment.Group>
					<Segment basic attached='top' style={{ padding: '0' }}>
						<Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
						<Segment basic style={activityImageTextStyle}>
							<Item.Group>
								<Item>
									<Item.Content>
										<Header
											size='huge'
											content={activity.title}
											style={{ color: 'white' }}
										/>
										<p>{activity.date}</p>
										<p>
											Hosted by <strong>Bob</strong>
										</p>
									</Item.Content>
								</Item>
							</Item.Group>
						</Segment>
					</Segment>
					<Segment clearing attached='bottom'>
						<Button color='teal'>Join Activity</Button>
						<Button>Cancel attendance</Button>
						<Button color='orange' floated='right'>
							Manage Event
						</Button>
					</Segment>
				</Segment.Group>
	)
}

export default observer(ActivityDetailedHeader);
