import { tot } from 'tobil';
import { erm, q } from 'esrar';
import { nt } from 'nefs';

export default class MovePicker {

  pgns: Array<erm.QPGN>
  lastPick?: erm.QPGN
  outOfBook = false
  
  constructor() {
    this.pgns = [];
  }

  tag(pgn: erm.QPGN) {
    return pgn.tags.get('Event');
  }

  abort() {
    this.lastPick = undefined;
    this.outOfBook = false;
  }

  setPgns(pgns: Array<erm.QPGN>) {
    this.pgns = pgns;
  }

  pickFromQMoves(moves: Array<erm.QMove>) {
    return moves[0]
  }

  pick(fen: nt.Fen) {
    let chats = [],
    move;

    if (!this.lastPick) {
      this.lastPick = this.pgns.find(_ => q.qFen(_, fen));

      if (this.lastPick) {
        chats.push(`Entering ${this.tag(this.lastPick)}`);
      }
      
    }

    if (this.lastPick) {
      let qmoves = q.qFen(this.lastPick, fen);
      if (qmoves) {
        let qmove = this.pickFromQMoves(qmoves);
        if (qmove) {
          move = q.qUci(qmove);
        }
      }
    }

    if (move) {
      let res: Array<tot.PlayStateAction> = [move];
      res = res.concat(chats.map(chat => ({ chat })));
      return res;
    } else {
      if (!this.outOfBook) {
        this.outOfBook = true;

        let chat = `Out of book now.`;
        
        return [{
          chat
        }];
      }
    }
  }
  
}
