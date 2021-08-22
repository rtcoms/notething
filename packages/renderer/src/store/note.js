import { defineStore } from 'pinia';
import { nanoid } from 'nanoid';
import { useStorage } from '../composable/storage';

const storage = useStorage();

export const useNoteStore = defineStore('note', {
  state: () => ({
    data: {},
  }),
  getters: {
    notes: (state) => Object.values(state.data),
    getById: (state) => (id) => state.data[id],
  },
  actions: {
    retrieve() {
      return new Promise((resolve) => {
        storage.get('notes', {}).then((data) => {
          this.data = data;

          resolve(data);
        });
      });
    },
    add(note = {}) {
      return new Promise((resolve) => {
        const id = nanoid();

        this.data[id] = {
          id,
          title: '',
          content: { type: 'doc', content: [] },
          labels: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isBookmarked: false,
          isArchived: false,
          ...note,
        };

        storage.set('notes', this.data).then(() => resolve(this.data[id]));
      });
    },
    update(id, data = {}) {
      return new Promise((resolve) => {
        this.data[id] = {
          ...this.data[id],
          ...data,
        };

        storage
          .set(`notes.${id}`, this.data[id])
          .then(() => resolve(this.data[id]));
      });
    },
    delete(id) {
      return new Promise((resolve) => {
        const lastEditedNote = localStorage.getItem('lastNoteEdit');

        if (lastEditedNote === id) localStorage.removeItem('lastNoteEdit');

        delete this.data[id];

        storage.delete(`notes.${id}`).then(() => resolve(id));
      });
    },
  },
  /*addLabel(id, labelId, type = 'add') {
    return new Promise((resolve) => {
      if (this.data[id]) {
        const labelIndex = this.data[id].labels.indexOf(labelId);

        labelIndex !== -1
          ? this.data[id].labels.splice(labelIndex, 1)
          : this.data[id].labels.push(labelId);

        storage
          .set(`notes.${id}`, this.data[id])
          .then(() => resolve(labelId));
      }
    });
  }*/
});
