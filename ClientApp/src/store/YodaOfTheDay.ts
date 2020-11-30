import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface YodaOfTheDayState {
    isLoading: boolean;
    startDateIndex?: number;
    quotes: YodaOfTheDay[];
}

export interface YodaOfTheDay {
    id: number;
    text: string;
    author: string;
    date: string;
    categoryId: number;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestYodaOfTheDayAction {
    type: 'REQUEST_YODA_OF_THE_DAY';
    startDateIndex: number;
}

interface ReceiveYodaOfTheDayAction {
    type: 'RECEIVE_YODA_OF_THE_DAY';
    startDateIndex: number;
    quotes: YodaOfTheDay[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestYodaOfTheDayAction | ReceiveYodaOfTheDayAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestYodaOfTheDay: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.yodaOfTheDay && startDateIndex !== appState.yodaOfTheDay.startDateIndex) {
            fetch(`https://localhost:5001/quote/all`)
                .then(response => response.json() as Promise<YodaOfTheDay[]>)
                .then(data => {
                    console.log(data);
                    dispatch({ type: 'RECEIVE_YODA_OF_THE_DAY', startDateIndex: startDateIndex, quotes: data });
                });

            dispatch({ type: 'REQUEST_YODA_OF_THE_DAY', startDateIndex: startDateIndex });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: YodaOfTheDayState = { quotes: [], isLoading: false };

export const reducer: Reducer<YodaOfTheDayState> = (state: YodaOfTheDayState | undefined, incomingAction: Action): YodaOfTheDayState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_YODA_OF_THE_DAY':
            return {
                startDateIndex: action.startDateIndex,
                quotes: state.quotes,
                isLoading: true
            };
        case 'RECEIVE_YODA_OF_THE_DAY':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.startDateIndex,
                    quotes: action.quotes,
                    isLoading: false
                };
            }
            break;
    }

    return state;
};
