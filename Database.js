import { v4 as uuid } from "uuid";
class Database {
  constructor() {
    this.db = new Object();
    this.callDb = new Map();
  }

  getBySocketId = (item) => {
    return this.db[item] ?? "";
  };

  updateStatus = (...args) => {
    const status = args.at(-1);
    const callId = uuid();
    args.forEach((socketid) => {
      if (socketid !== status) {
        const getItem = this.getBySocketId(socketid);
        getItem.status = status;
        getItem.callDb = callId;
        this.setItem(socketid, getItem);
      }
    });
    const currStatus = args.pop()
    const createUserCurrentStatus = {socketIds: args, status: currStatus} // {socketIds:[xyz, abc], status: 'idle'} standard
    this.callDb.set(callId, createUserCurrentStatus);
    return this.callDb.get(callId);
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
}

// {
//   'ajasefaJIFDOWJFO': {
//     status: 'OK',
//     peerId: 'fjJKFJKDFJDKJOIJREO'
//   }
// }

export default new Database();
