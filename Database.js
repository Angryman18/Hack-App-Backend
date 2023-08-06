class Database {
  constructor() {
    this.db = new Object();
  }

  getBySocketId = (item) => {
    return this.db[item] ?? "";
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
