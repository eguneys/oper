import { at } from 'apil';
import { tot } from 'tobil';
import esrar, { erm, StudyBuilder } from 'esrar';
import { study } from 'apil';
import MovePicker from './picker';
import { misc } from 'chesst';

export default class StudyImport {

  picker: MovePicker
  
  constructor() {
    this.picker = new MovePicker();
  }

  setPgns(builder: StudyBuilder) {
    this.picker.setPgns(builder.pgns);
  }

  abort(status: at.GameStatus) {
    this.picker.abort();
  }

  move(position: string, moves: Array<string>) {
    let res;
    let fen = misc.fenAfterUcis(position, moves);
    console.log(fen, moves);
    if (fen) {
      res = this.picker.pick(fen);
    }
    return Promise.resolve(res);
  }

  async maybeLoad(studyId: string) {
    let studyIdReg = /^https:\/\/lichess\.org\/study\/([A-Za-z0-9]{8})$/;
    let match = studyId.match(studyIdReg);
    try {
      if (match) {
        let allChapters = await study.allChapters(match[1]);
        let builder = esrar(allChapters);
        this.setPgns(builder);
        
        return [{
          chat: `Loaded study id ${match[1]} ${builder.pgns.length} pgns`
        }];
      }
    } catch (e) {
      return [{
        chat: `Couldnt load study: ${studyId}`
      }]
    }
    return [];
  }
  
}
