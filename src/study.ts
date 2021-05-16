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
    let chapterIdReg = /^https:\/\/lichess\.org\/study\/([A-Za-z0-9]{8})\/([A-Za-z0-9]{8})$/
    let studyIdReg = /^https:\/\/lichess\.org\/study\/([A-Za-z0-9]{8})$/;
    let match = studyId.match(chapterIdReg);
    let pgns;
    if (match) {
      pgns = await study.oneChapter(match[1], match[2]);
    } else {
      match = studyId.match(studyIdReg);
      if (match) {
        pgns = await study.allChapters(match[1]);
      }
    }
    try {
      if (pgns) {
        let builder = esrar(pgns);
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
