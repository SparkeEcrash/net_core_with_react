import { SyntheticEvent, createContext } from 'react';
import { observable, action, computed } from 'mobx';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

class ActivityStore {
	@observable activityRegistry = new Map();
	@observable activities: IActivity[] = [];
	@observable selectedActivity: IActivity | undefined;
	@observable loadingInitial = false;
	@observable editMode = false;
	@observable submitting = false;
	@observable target = '';

	@computed get activitiesByDate() {
		return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date)); 
	}

	@action setTarget = (name: string )=> {
		this.target = name;
	}

	@action loadActivities = async () => {
		this.loadingInitial = true;
		try {
			const activities = await agent.Activities.list();
			activities.forEach(activity => {
				activity.date = activity.date.split('.')[0];
				this.activityRegistry.set(activity.id, activity);
			});
			this.loadingInitial = false;	
		} catch (error) {
			console.log(error);
			this.loadingInitial = false;
		}
    // agent.Activities.list()
    //   .then(response => {
		// 		response.forEach(activity => {
		// 			activity.date = activity.date.split('.')[0];
		// 			this.activities.push(activity);
		// 		})
		// 	})
		// 	.catch((error) => console.log(error))
		// 	.finally(() => this.loadingInitial = false)
	}

	@action createActivity = async (event: SyntheticEvent<HTMLFormElement>, activity: IActivity) => {
		this.submitting = true;
		this.setTarget(event.currentTarget.name);
		try {
			await agent.Activities.create(activity);
			//.set() adds or updates
			this.activityRegistry.set(activity.id, activity);
			this.selectedActivity = activity;
			this.editMode = false;
			this.submitting = false;
		} catch (error) {
			this.submitting = false;
			console.log(error);
		}
	};

	@action editActivity = async (event: SyntheticEvent<HTMLFormElement>, activity: IActivity) => {
		this.submitting = true;
		this.setTarget(event.currentTarget.name);
		try {
			//.set() adds or updates
			await agent.Activities.update(activity);
			this.activityRegistry.set(activity.id, activity);
			this.selectedActivity = activity;
			this.editMode = false;
			this.submitting = false;
		} catch (error) {
			this.submitting = false;
			console.log(error);
		}
	}

	@action openCreateForm = () => {
		this.editMode = true;
		this.selectedActivity = undefined;
	}

	@action openEditForm = () => {
		this.editMode = true;
	}

	@action cancelSelectedActivity = () => {
		this.selectedActivity = undefined;
	}

	@action cancelFormOpen = () => {
		this.editMode = false;
	}

	@action selectActivity = (id: string) => {
		this.selectedActivity = this.activityRegistry.get(id);
		this.editMode = false;
	}
}

export default createContext(new ActivityStore())