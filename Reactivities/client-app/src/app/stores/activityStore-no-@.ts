import { SyntheticEvent, createContext } from "react";
import { observable, action, computed, configure, runInAction, decorate } from "mobx";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
	//CHANGE ONE HERE: REMOVE ALL THE @DECORATORS LIKE @obseravable
  activityRegistry = new Map();
  activities: IActivity[] = [];
  selectedActivity: IActivity | undefined;
  loadingInitial = false;
  editMode = false;
  submitting = false;
  target = "";

	//CHANGE TWO HERE: REMOVE ALL THE @ DECORATORS FOR EACH FUNCTION LIKE @action and @computed

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  setTarget = (name: string) => {
    this.target = name;
  };

  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("load activities error", () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  createActivity = async (
    event: SyntheticEvent<HTMLFormElement>,
    activity: IActivity
  ) => {
    this.submitting = true;
    this.setTarget(event.currentTarget.name);
    try {
      await agent.Activities.create(activity);
      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
			runInAction('create activity error', () => {
				this.submitting = false;
			})
      console.log(error);
    }
  };

  editActivity = async (
    event: SyntheticEvent<HTMLFormElement>,
    activity: IActivity
  ) => {
    this.submitting = true;
    this.setTarget(event.currentTarget.name);
    try {
			await agent.Activities.update(activity);
			runInAction('editing activity', () => {
				this.activityRegistry.set(activity.id, activity);
				this.selectedActivity = activity;
				this.editMode = false;
				this.submitting = false;
			})
    } catch (error) {
			runInAction('edit activity error', () => {
				this.submitting = false;
			})
      console.log(error);
    }
  };

  deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.setTarget(event.currentTarget.name);
    try {
			await agent.Activities.delete(id);
			runInAction('deleting activity', () => {
				this.activityRegistry.delete(id);
				this.submitting = false;
				this.target = "";
			})
    } catch (error) {
			runInAction('delete activity error', () => {
				this.submitting = false;
				this.target = "";	
			})
      console.log(error);
    }
  };

  openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  openEditForm = () => {
    this.editMode = true;
  };

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  cancelFormOpen = () => {
    this.editMode = false;
  };

  selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };
}

//CHANGE THREE HERE: ASSIGN ALL THE DECORATORS HERE
decorate(ActivityStore, {
	activityRegistry: observable,
	activities: observable,
	selectedActivity: observable,
	loadingInitial: observable,
	editMode: observable,
	submitting: observable,
	target: observable,
	activitiesByDate: computed,
	loadActivities: action,
	createActivity: action,
	editActivity: action,
	deleteActivity: action,
	openCreateForm: action,
	cancelSelectedActivity: action,
	cancelFormOpen: action,
	selectActivity: action
})

export default createContext(new ActivityStore());
