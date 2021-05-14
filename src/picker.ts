import { tot } from 'tobil';
import { erm, q } from 'esrar';

export default class MovePicker {

  pgns: Array<erm.QPGN>
  lastPick?: erm.QPGN
  lastMove?: erm.QMove
  
  constructor() {
    this.pgns = [];
  }

  tag(pgn: erm.QPGN) {
    return pgn.tags.get('Event');
  }

  abort() {
    console.log('aborted');
    this.lastMove = undefined;
    this.lastPick = undefined;
  }

  setPgns(pgns: Array<erm.QPGN>) {
    this.pgns = pgns;
  }

  pickFromQMoves(moves: Array<erm.QMove>) {
    return moves[0]
  }

  pick(fen: string) {
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
          this.lastMove = qmove;
        }
      }

      if (move) {
        let res: Array<tot.PlayStateAction> = [move];
        res = res.concat(chats.map(chat => ({ chat })));
        return res;
      } else {
        if (this.lastMove) {
          let score = q.qScore(this.lastPick, this.lastMove);
          
          this.lastMove = undefined;

          let chat = `Out of book now. Score: ${score.ply}/${score.maxPly}`;
          
          return [{
            chat
          }];
        }
      }
    } else {
      return [];
    }
  }
  
}
