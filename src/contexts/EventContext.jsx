import React, { createContext, useContext, useReducer, useEffect } from 'react'
import supabase from '../supabaseClient';

const EventContext = createContext(null)

const initialState = []

const eventReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_EVENT_SUCCESS':
      return [...state, action.payload];
    case 'UPDATE_EVENT_SUCCESS':
      return state.map(event =>
        event.id === action.payload.id ? action.payload : event
      );
    case 'DELETE_EVENT_SUCCESS':
      return state.filter(event => event.id !== action.payload);
    case 'TOGGLE_COMPLETE_SUCCESS':
      return state.map(event =>
        event.id === action.payload.id ? { ...event, completed: action.payload.completed } : event
      );
    case 'TOGGLE_SUBTASK_COMPLETE_SUCCESS':
      return state.map(event =>
        event.id === action.payload.eventId
          ? {
              ...event,
              subtasks: event.subtasks.map((subtask, index) =>
                index === action.payload.subtaskIndex
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              )
            }
          : event
      );
    case 'SET_EVENTS':
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
        dispatch({ type: 'SET_EVENTS', payload: data });
      }
    };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (event) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([event])
        .select()
      if (error) {
        console.error('Error adding event:', error);
      } else {
        if (data && data.length > 0) {
          dispatch({ type: 'ADD_EVENT_SUCCESS', payload: data[0] });
        } else {
          console.error('Error: data is null after insert');
        }
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const updateEvent = async (event) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(event)
        .eq('id', event.id)
        .select()
      if (error) {
        console.error('Error updating event:', error);
      } else {
        if (data && data.length > 0) {
          dispatch({ type: 'UPDATE_EVENT_SUCCESS', payload: data[0] });
        } else {
          console.error('Error: data is null after update');
        }
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', eventId)
      if (error) {
        console.error('Error deleting event:', error);
      } else {
        dispatch({ type: 'DELETE_EVENT_SUCCESS', payload: eventId });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const toggleComplete = async (eventId, completed, subtaskIndex = null) => {
    try {
      if (subtaskIndex !== null) {
        const { data, error } = await supabase
          .from('tasks')
          .select('subtasks')
          .eq('id', eventId)
          .single()

        if (error) {
          console.error('Error fetching subtasks:', error);
          return;
        }

        const updatedSubtasks = data.subtasks.map((subtask, index) =>
          index === subtaskIndex ? { ...subtask, completed: !subtask.completed } : subtask
        );

        await supabase
          .from('tasks')
          .update({ subtasks: updatedSubtasks })
          .eq('id', eventId)

        dispatch({ type: 'TOGGLE_SUBTASK_COMPLETE_SUCCESS', payload: { eventId, subtaskIndex } });
        return
      }
      const { data, error } = await supabase
        .from('tasks')
        .update({ completed: !completed })
        .eq('id', eventId)
        .select()
      if (error) {
        console.error('Error toggling complete:', error);
      } else {
        if (data && data.length > 0) {
          dispatch({ type: 'TOGGLE_COMPLETE_SUCCESS', payload: { id: eventId, completed: !completed } });
        } else {
          console.error('Error: data is null after toggle complete');
        }
      }
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };

  return (
    <EventContext.Provider value={{ events, dispatch, addEvent, updateEvent, deleteEvent, toggleComplete,  }}>
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
