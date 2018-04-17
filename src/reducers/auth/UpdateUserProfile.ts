import {Action, createAction} from 'redux-actions';
import {UserProfile} from './authReducer';

type UpdateUserProfile = 'UpdateUserProfile';
export const UpdateUserProfile: UpdateUserProfile = 'UpdateUserProfile';
export interface UpdateUserProfileAction extends Action<UserProfile>{
    type: UpdateUserProfile
}

export const updateUserProfile = createAction<UserProfile>(UpdateUserProfile);