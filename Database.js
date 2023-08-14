import { v4 as uuid } from "uuid";
class Database {
  constructor() {
    this.db = new Object();
    this.callDb = new Map();
  }

  getBySocketId = (item) => {
    return this.db[item] ?? {};
  };

  getByCallId = (callId) => this.callDb.get(callId) ?? {};

  findUserIsInCallWith = (socketId) => {};

  updateStatusBySocketIds = (...context) => {
    const [callId, callStatus] = [context.at(-2), context.at(-1)];
    context.forEach((socketid) => {
      if (![callId, callStatus].includes(socketid)) {
        const getItem = this.getBySocketId(socketid);
        getItem.status = callStatus;
        getItem.callId = callId;
        this.setItem(socketid, getItem);
      }
    });
  };

  updateStatus = (...args) => {
    // socketId1, socketId2, true, 'in call'
    const status = args?.at(-1);
    const callId = args?.at(-2) ? uuid() : null;
    args[2] = callId; // upateing
    this.updateStatusBySocketIds.apply(this, args); // socketId1, socketId2, callId, 'in call'

    const createUserCurrentStatus = { socketIds: args.slice(0, 2), status }; // {socketIds:[xyz, abc], status: 'idle'} standard
    this.callDb.set(callId, createUserCurrentStatus);
    return { ...this.callDb.get(callId), callId };
  };

  findToBeNotifiedUser = (socketId, callId) => {
    const { socketIds = [] } = this.callDb.get(callId) ?? {};
    return socketIds.reduce((socketuser, val) => {
      if (val !== socketId) {
        socketuser = val;
      }
      return socketuser;
    }, "");
  };

  resetCallDatabase = (callId) => {
    this.callDb.delete(callId);
  };

  getByPeerId = (peerId) => {
    const findIt = Object.entries(this.db).find(([, id]) => id === peerId);
    return findIt;
  };

  setItem(item, data) {
    this.db[item] = data;
    return this.db[item];
  }

  removeBySocketId = (socketId) => {
    delete this.db[socketId];
    return this.socketId;
  };

  getAll = () => this.db;
  getCallDb = () => this.callDb;
}

// {
//   'ajasefaJIFDOWJFO': {
//     status: 'OK',
//     peerId: 'fjJKFJKDFJDKJOIJREO'
//   }
// }

export default new Database();
