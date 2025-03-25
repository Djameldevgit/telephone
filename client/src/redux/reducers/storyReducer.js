 import { STORY_TYPES } from '../actions/storyAction';
import { EditData } from '../actions/globalTypes'

 
const initialState = {
    loading: false,
    ids: [],
    users: [],
    posts: []
}

const storyReducer = (state = initialState, action) => {
    switch (action.type){
        case STORY_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case STORY_TYPES.GET_USER:
            return {
                ...state,
                users: [...state.users, action.payload.user]
            };
        case STORY_TYPES.FOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };
        case STORY_TYPES.UNFOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };
        case STORY_TYPES.GET_ID:
            return {
                ...state,
                ids: [...state.ids, action.payload]
            };
        case STORY_TYPES.GET_POSTS:
            return {
                ...state,
                posts: [...state.posts, action.payload]
            };
        case STORY_TYPES.UPDATE_POST:
            return {
                ...state,
                posts: EditData(state.posts, action.payload._id, action.payload)
            };
        default:
            return state;
    }
}

export default storyReducer