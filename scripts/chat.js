//** all chat rooms connection to db logic available here */

// add  new chat document
// setup realtime listeners to get new chat
// update username
// update the room


class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.chats = db.collection('chats');
    this.unsub;
  }

  // add-a new chat doc
  async addChat(message) {
    // format a chat object
    const now = new Date();
    const chat = {
      message,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(now)
    };

    const response = await this.chats.add(chat);
    return response;
  }

  // setup realtime listeners to get new chat
  getChat(callbackfn) {
    this.unsub = this.chats
      .where('room', '==', this.room)
      .orderBy('created_at')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            //update UI
            callbackfn(change.doc.data());
          }
        });

      });

  }

  // update the username and update room
  updateName(username) {
    this.username = username;
    localStorage.setItem('username', username);
  }

  updateRoom(room) {
    this.room = room;
    console.log('room updated');
    if (this.unsub) {
      this.unsub();
    }
  }

  // cls-Chatroom ends
}