import React, { createContext, useContext, useReducer, useEffect } from 'react'
import supabase from '../supabaseClient';

const EventContext = createContext(null)

const initialState = []

const eventReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_EVENT':
      console.log('ADD_EVENT action received:', action.payload);
      supabase
        .from('tasks')
        .insert([action.payload])
        .then(({ data, error }) => {
          if (error) {
            console.error('Error adding event:', error);
          } else {
            if (data && data.length > 0) {
              console.log('ADD_EVENT_SUCCESS dispatched with:', data[0]);
              dispatch({ type: 'ADD_EVENT_SUCCESS', payload: data[0] });
            } else {
              console.error('Error: data is null after insert');
            }
          }
        });
      return state;
    case 'ADD_EVENT_SUCCESS':
      console.log('ADD_EVENT_SUCCESS reducer, state:', state, 'payload:', action.payload);
      return [...state, action.payload];
    case 'UPDATE_EVENT':
      console.log('UPDATE_EVENT action received:', action.payload);
      supabase
        .from('tasks')
        .update(action.payload)
        .eq('id', action.payload.id)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error updating event:', error);
          } else {
            if (data && data.length > 0) {
              console.log('UPDATE_EVENT_SUCCESS dispatched with:', data[0]);
              dispatch({ type: 'UPDATE_EVENT_SUCCESS', payload: data[0] });
            } else {
              console.error('Error: data is null after update');
            }
          }
        });
      return state;
    case 'UPDATE_EVENT_SUCCESS':
      console.log('UPDATE_EVENT_SUCCESS reducer, state:', state, 'payload:', action.payload);
      return state.map(event =>
        event.id === action.payload.id ? action.payload : event
      );
    case 'DELETE_EVENT':
      console.log('DELETE_EVENT action received:', action.payload);
      supabase
        .from('tasks')
        .delete()
        .eq('id', action.payload)
        .then(({ error }) => {
          if (error) {
            console.error('Error deleting event:', error);
          } else {
            console.log('DELETE_EVENT_SUCCESS dispatched with:', action.payload);
            // dispatch({ type: 'DELETE_EVENT_SUCCESS', payload: action.payload });
          }
        });
      return state;
    case 'DELETE_EVENT_SUCCESS':
      return state.filter(event => event.id !== action.payload);
    case 'TOGGLE_COMPLETE':
      supabase
        .from('tasks')
        .update({ completed: !state.find(event => event.id === action.payload).completed })
        .eq('id', action.payload)
        .then(({ error, data }) => {
          if (error) {
            console.error('Error toggling complete:', error);
          } else {
            if (data && data.length > 0) {
              console.log('TOGGLE_COMPLETE_SUCCESS dispatched with:', action.payload);
              dispatch({ type: 'TOGGLE_COMPLETE_SUCCESS', payload: action.payload });
            } else {
              console.error('Error: data is null after toggle complete');
            }
          }
        });
      return state;
    case 'TOGGLE_COMPLETE_SUCCESS':
      return state.map(event =>
        event.id === action.payload
          ? { ...event, completed: !event.completed }
          : event
      );
    case 'SET_EVENTS':
      console.log('SET_EVENTS action received:', action.payload);
      return action.payload;
    default:
      return state;
  }
};

const migrateLocalStorageToSupabase = async (events) => {
  if (!events || events.length === 0) return;

  try {
    const { error } = await supabase
      .from('tasks')
      .insert(events);

    if (error) {
      console.error('Error migrating data:', error);
    } else {
      localStorage.removeItem('calendar-events');
      console.log('Data migrated successfully');
    }
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

export function EventProvider({ children }) {
  const [events, dispatch] = useReducer(eventReducer, initialState, () => {
    const savedEvents = localStorage.getItem('calendar-events');
    const parsedEvents = savedEvents ? JSON.parse(savedEvents) : initialState;
    migrateLocalStorageToSupabase(parsedEvents);
    return initialState;
  });

  const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        console.log('Initial fetch, SET_EVENTS dispatched with:', data);
        dispatch({ type: 'SET_EVENTS', payload: data });
      }
    };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider value={{ events, dispatch }}>
      {children}
    </EventContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider')
  }
  return context
}
