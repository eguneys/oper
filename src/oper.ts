import { IMover } from 'movil';
import { at } from 'apil';
import { tot } from 'tobil';
import StudyImport from './study';
import { getStudyImport } from './getstudy';
import { PamCache } from 'pampu';

export default class Oper implements IMover {

  studies: PamCache<at.UserId, Promise<StudyImport>>
  
  constructor() {
    this.studies = new PamCache<at.UserId, Promise<StudyImport>>({
      size: 4,
      loader: getStudyImport
    })
  }

  init() {
    return Promise.resolve();
  }

  async move(position: string, moves: Array<string>, state: tot.PlayState) {
    let sim = await this.studies.get(state.opponent.id);
    
    return sim.move(position, moves);
  }

  async chat(line: at.ChatLine) {
    let sim = await this.studies.get(line.username);
    return sim.maybeLoad(line.text);
  }

  async abort(status: at.GameStatus, state: tot.PlayState) {
    let sim = await this.studies.get(state.opponent.id);

    sim.abort(status);
  }
  
  greeting = 'Imported Study moves playing'
}
