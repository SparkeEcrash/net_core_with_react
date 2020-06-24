import { SyntheticEvent, createContext } from "react";
import { observable, action, computed, configure, runInAction } from "mobx";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  @action setTarget = (name: string) => {
    this.target = name;
  };

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      //runInAction is necessary to use mobx in strict mode to enhance performance
      //runInaction takes in a callback function to be run after the asynchronous function
      //and this is necessary when state information is getting mutated/changed in the callback in the
      //.then() portion after a promise

      // SYNTAX
      // .then(() => {...code here}) or anything after await should be rewritten as...
      // runInAction('name of runInAction', () => {...code here})
      // this stuff is necessary for mobx dev tools
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
    // agent.Activities.list()
    //   .then(response => {
    // 		response.forEach(activity => {
    // 			activity.date = activity.date.split('.')[0];
    // 			this.activities.push(activity);
    // 		})
    // 	})
    // 	.catch((error) => console.log(error))
    // 	.finally(() => this.loadingInitial = false)
  };

  @action createActivity = async (
    event: SyntheticEvent<HTMLFormElement>,
    activity: IActivity
  ) => {
    this.submitting = true;
    this.setTarget(event.currentTarget.name);
    try {
      await agent.Activities.create(activity);
      runInAction('creating activity', () => {
        //.set() adds or updates
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

  @action editActivity = async (
    event: SyntheticEvent<HTMLFormElement>,
    activity: IActivity
  ) => {
    this.submitting = true;
    this.setTarget(event.currentTarget.name);
    try {
      //.set() adds or updates
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

  @action deleteActivity = async (
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

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  @action openEditForm = () => {
    this.editMode = true;
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  @action cancelFormOpen = () => {
    this.editMode = false;
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());
