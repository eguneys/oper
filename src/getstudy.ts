import StudyImport from './study';
import { at } from 'apil';

export function getStudyImport(userId: at.UserId) {

  return Promise.resolve(new StudyImport());
  
}
