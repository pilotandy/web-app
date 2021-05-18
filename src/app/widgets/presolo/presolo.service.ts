import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Question {
    id: number;
    text: string;
}

export interface Answer {
    id: number;
    text: string;
}

@Injectable({
    providedIn: 'root',
})
export class PreSoloService {
    questions = [
        {
            id: 1,
            text: 'Define and list the following speeds for your aircraft:\nVs-\nVso-\nVx-\nVy-\nVa-\nVfe-\nVno-\nVne-\n',
        },
        {
            id: 2,
            text: 'What is the airplane’s best glide speed? When is it used?',
        },
        {
            id: 3,
            text: 'State the procedure to respond to an in-flight engine failure.',
        },
        {
            id: 4,
            text: 'List the procedure to respond to an engine fire on the ground while starting.',
        },
        {
            id: 5,
            text: 'List the procedure for lost communications when arriving at an airport with an operating control tower.',
        },
        { id: 6, text: 'What is the procedure for spin recovery?' },
        {
            id: 7,
            text: 'What is the maximum gross weight of the airplane in the Normal category?',
        },
        {
            id: 8,
            text: 'If a glider is converging with an airplane, which has the right of way?',
        },
        {
            id: 9,
            text: 'What are the limit load factors in both the Normal and Utility categories with the flaps up and down?',
        },
        {
            id: 10,
            text: 'What preflight action is required of a pilot prior to a flight?',
        },
        { id: 11, text: 'What is the maximum rpm of your airplane’s engine?' },
        { id: 12, text: 'Define an aerobatic maneuver.' },
        { id: 13, text: 'Generally describe the engine in your airplane.' },
        {
            id: 14,
            text: 'What is the oil capacity in your airplane? What is the minimum?',
        },
        {
            id: 15,
            text: 'What is the minimum amount of time a pilot is required to wait after the consumption of alcohol?',
        },
        {
            id: 16,
            text: 'What would happen to the fuel indicators if all electricity in the airplane was lost?',
        },
        {
            id: 17,
            text: 'What are the basic VFR weather minimums? What is the minimum visibility for a student pilot?',
        },
        {
            id: 18,
            text: 'Why is it necessary to drain fuel out of the sumps after refueling and before the first flight of the day?',
        },
        {
            id: 19,
            text: 'List and describe each of the light gun signals available from air traffic control.',
        },
        {
            id: 20,
            text: 'Will the engine still run if the master switch is turned off? Why?',
        },
        {
            id: 21,
            text: 'What are wing-tip vortices (wake turbulence)? With which aircraft are they greatest? Describe the proper avoidance.',
        },
        {
            id: 22,
            text: 'What endorsements are required for solo flight? What three documents must you have in your possession to solo an aircraft as a student?',
        },
        {
            id: 23,
            text: 'During a mag check, what is the maximum allowable rpm drop?',
        },
        {
            id: 24,
            text: 'Draw an airport traffic pattern, labeling each leg and the proper entry and departure points. Which turn direction is standard for an airport traffic pattern?',
        },
        {
            id: 25,
            text: 'List the traffic pattern altitude, direction of turns, noise abatement procedures, and all radio frequencies for the following local area airports and their runways.',
        },
        {
            id: 26,
            text: 'What is the fuel capacity of the aircraft you fly? How much is usable fuel?',
        },
        {
            id: 27,
            text: 'What is the authority and responsibility of the pilot in command?',
        },
        { id: 28, text: 'When are you required to wear a safety belt?' },
        {
            id: 29,
            text: 'When are you permitted to deviate from an ATC instruction?',
        },
        {
            id: 30,
            text: 'What grade(s) of aviation fuel is/are available for use? What color is each?',
        },
        {
            id: 31,
            text: 'When an aircraft is approaching another head-on, each pilot should alter their course to the ______________.',
        },
        {
            id: 32,
            text: 'A(n) ______________ on the runway indicates that the runway is closed.',
        },
        {
            id: 33,
            text: 'Draw the pavement marking requiring you to stop before entering a runway.',
        },
        {
            id: 34,
            text: 'When is dropping objects from an airplane permitted?',
        },
        {
            id: 35,
            text: 'The _____________________________ of two aircraft on approach to the same runway has the right of way.',
        },
        {
            id: 36,
            text: 'What must a pilot do before entering Class D airspace?',
        },
        {
            id: 37,
            text: 'What is the minimum safe altitude anywhere? Over congested areas?',
        },
        {
            id: 38,
            text: 'List the documents that must be aboard the aircraft at all times.',
        },
        { id: 39, text: 'When must the aircraft’s navigation lights be on?' },
        {
            id: 40,
            text: 'What is the minimum reserve fuel required for day VFR operations?',
        },
    ];
    constructor(private http: HttpClient) {}

    getQuestions() {
        return new Promise<Question[]>((resolve, reject) => {
            resolve(this.questions);
        });
    }

    save(answers: Answer[]) {
        return new Promise<void>((resolve, reject) => {
            const params = {
                answers,
            };
            this.http.post('/api/presolo/', params).subscribe(
                () => {
                    resolve();
                },
                (err) => {
                    console.log(err);
                    reject();
                }
            );
        });
    }
}
