var state = [];

class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);
        
        if(locationData.Choices.length > 0) {
            for(let choice of locationData.Choices) {
                let meetsConditions = true;
                choice.Conditions.forEach(element => {
                    if(!state.includes(element)){
                        meetsConditions = false;
                    }
                });
                choice.ConditionsNot.forEach(element => {
                    if(state.includes(element)){
                        meetsConditions = false;
                    }
                });
                if(meetsConditions){
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            choice.Result.forEach(element => {
                state.push(element);
            });
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');