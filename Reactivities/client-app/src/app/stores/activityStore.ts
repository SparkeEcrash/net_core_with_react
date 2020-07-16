import { SyntheticEvent, createContext } from "react";
import { observable, action, computed, configure, runInAction } from "mobx";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
		console.log(this.groupActivitiesByDate(Array.from(this.activityRegistry.values())))
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
	}
	
	groupActivitiesByDate(activities: IActivity[]) {
		const sortedActivities = activities.sort(
			(a, b) => Date.parse(a.date) - Date.parse(b.date)
		)
		return Object.entries(sortedActivities.reduce((activities, activity) => {
			const date = activity.date.split('T')[0];
			activities[date] = activities[date] ? [...activities[date], activity] : [activity];
			return activities;
		}, {} as {[key: string]: IActivity[]}));
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
			console.log(this.groupActivitiesByDate(activities));
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
	
	@action loadActivity = async (id: string) => {
		let activity = this.getActivity(id);
		if (activity) {
			console.log('test #1')
			this.activity = activity;
		} else {
			console.log('test #2')
			this.loadingInitial = true;
			try {
				activity = await agent.Activities.details(id);
				runInAction('getting activity', () => {
					this.activity = activity;
					this.loadingInitial = false;
				})
			} catch (error) {
				runInAction('getting activity error', () => {
					this.loadingInitial = false;
				})
				console.log(error);
			}
		}
	}

	@action clearActivity = () => {
		this.activity = null;
	}

	getActivity = (id: string) => {
		return this.activityRegistry.get(id);
	}

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
        this.activity = activity;
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
				this.activity = activity;
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
}

export default createContext(new ActivityStore());
